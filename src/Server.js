"use strict";

const grpc = require('grpc');
const winston = require('winston');
const asciify = require('asciify');

const Service = require('./service/Service');

class Server {
    /**
     * @param {Object} config
     */
    constructor(config) {

        this.config = config;

        this.grpcServer = new grpc.Server();

        this.services = [];

        for (let serviceConfig of this.config) {
            this.addService(new Service(serviceConfig.name, serviceConfig));
        }
    }

    /**
     * Start server
     *
     * @returns {Promise}
     */
    start() {
        let connectionString = `${process.env.GRPC_HOST}:${process.env.GRPC_PORT}`;

        this.grpcServer.bind(
            connectionString,
            grpc.ServerCredentials.createInsecure()
        );

        let connectorsReadyPromises = this.services.map((service) => {
            return service.connector.ready;
        });

        return Promise.all(connectorsReadyPromises).then(() => {
            this.grpcServer.start();

            let servicesString = this.services.map((service) => {
                return ' - ' + service.name;
            }).join("\n");

            console.log(`GRPC Loaded Services:\n${servicesString}\n`);
        }).catch((error) => {
            this.logger.error(error);
        });
    }

    /**
     * Stop the server
     *
     * @returns {Promise}
     */
    stop() {
        return new Promise((resolve) => {
            this.grpcServer.tryShutdown(() => {
                let lastsRequestsPromise = this.services.map((service) => {
                    return service.connector.lastRequestPromise;
                }).filter((promise) => {
                    return promise !== null;
                });

                Promise.all(lastsRequestsPromise).then(resolve, resolve);
            });
        }).catch((error) => {
            console.log(error);

            throw error;
        });
    }

    /**
     * @param {Service} service
     * @returns {FastCgiConnector}
     */
    addService(service) {
        this.grpcServer.addService(
            service.description.getService(),
            service.handlersProvider.getHandlers()
        );

        this.services.push(service);
    }
}

module.exports = Server;
