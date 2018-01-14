const grpc = require('grpc');

class Server {

    constructor() {
        this.grpcServer = new grpc.Server();
        this.services = [];
    }

    /**
     * Startup the gRPC server.
     *
     * @param connectionString
     * @returns {Promise.<TResult>}
     */
    start(connectionString) {

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
                return ' - ' + service.protoService;
            }).join("\n");

            console.log(`GRPC Loaded Services:\n${servicesString}\n`);
        }).catch((error) => {
            console.log(error);
        });
    }

    /**
     * Stop the gRPC server.
     *
     * @returns {Promise.<T>}
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
     * Add the based service to the gRPC server.
     *
     * @param service
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
