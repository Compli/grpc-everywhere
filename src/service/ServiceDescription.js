require('object.values').shim();

class ServiceDescription {
    constructor(serviceName, proto) {
        this.proto = proto;
        this.serviceName = serviceName;
        this.packageName = ServiceDescription.getPackageNameOfService(serviceName);
        this.service = null;
    }

    getService() {
        if (this.service !== null) {
            return this.service;
        }

        let client = ServiceDescription.getClient(this.proto, this.serviceName);

        this.service = client.service;

        return this.service;
    }

    static getClient(proto, serviceName) {
        let node = proto;
        let chunks = serviceName.split('.');

        for (let chunk of chunks) {
            if (node.hasOwnProperty(chunk)) {
                node = node[chunk];
            }
        }

        console.log(node);

        return node;
    }

    getMethodsDescriptions() {
        let service = this.getService();

        let baseDescription = {
            packageName: this.packageName,
            serviceName: ServiceDescription.getBaseServiceName(this.serviceName),
        };

        let methods = [];

        for (let methodName of Object.keys(service)) {
            if (service.hasOwnProperty(methodName)) {
                let method = service[methodName];
                let methodDescription = Object.assign({
                    methodName: method.originalName,
                    requestMessageName: method.requestType.name,
                    responseMessageName: method.responseType.name,
                    isRequestStream: method.requestStream,
                    isResponseStream: method.responseStream
                }, baseDescription);

                methods.push(methodDescription);
            }
        }

        return methods;
    }

    static getPackageNameOfService(serviceName) {
        let serviceChunks = serviceName.split('.');
        serviceChunks.pop();

        return serviceChunks.join('.');
    }

    static getBaseServiceName(serviceName) {
        let serviceChunks = serviceName.split('.');
        return serviceChunks[serviceChunks.length - 1]
    }
}

module.exports = ServiceDescription;