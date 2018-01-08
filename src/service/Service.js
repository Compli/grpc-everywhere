const fs = require('fs');
const grpc = require('grpc');
const HandlersProvider = require('./HandlersProvider');
const ServiceDescription = require('./ServiceDescription');
const createConnector = require('./connector/createConnector');

class Service {
    constructor(name, config) {
        this.name = name;

        if (!fs.existsSync(config.protoFile)) {
            throw new Error(`${config.protoFile} proto file doesn't exists`);
        }

        let proto = grpc.load(config.protoFile);

        this.description = new ServiceDescription(config.service, proto);

        this.connector = createConnector(config.connector.name, config.connector.options);

        this.handlersProvider = new HandlersProvider(this.description, this.connector);
    }
}

module.exports = Service;