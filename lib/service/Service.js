const fs = require('fs');
const grpc = require('grpc');
const HandlersProvider = require('./HandlersProvider');
const ServiceDescription = require('./ServiceDescription');
const fastCGIConnector = require('./connector/FastCGIConnector');

class Service {
    constructor(config) {
        this.protoService = config.protoService;

        if (!fs.existsSync(config.protoFile)) {
            throw new Error(`${config.protoFile} proto file doesn't exists`);
        }

        let proto = grpc.load(config.protoFile);

        this.description = new ServiceDescription(config.protoService, proto);

        this.connector = new fastCGIConnector(config.phpEntrypoint, config.fastCGIOptions);

        this.handlersProvider = new HandlersProvider(this.description, this.connector);
    }
}

module.exports = Service;
