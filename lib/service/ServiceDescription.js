class ServiceDescription {

    constructor(serviceName, proto) {
        this.proto = proto;
        this.serviceName = serviceName;
        this.packageName = ServiceDescription.getPackageNameOfService(serviceName);
        this.service = null;
    }

    /**
     * Gets the current service information.
     *
     * @returns {*|null|grpc~ServiceDefinition}
     */
    getService() {
        if (this.service !== null) {
            return this.service;
        }

        let client = ServiceDescription.getClient(this.proto, this.serviceName);
        this.service = client.service;
        return this.service;
    }

    /**
     * Gets the client information for the service.
     *
     * @param proto
     * @param serviceName
     * @returns {*}
     */
    static getClient(proto, serviceName) {
        let node = proto;
        let chunks = serviceName.split('.');

        for (let chunk of chunks) {
            if (node.hasOwnProperty(chunk)) {
                node = node[chunk];
            }
        }

        return node;
    }

    /**
     * Gets all of the methods that were in the proto file and the information associated with them.
     *
     * @returns {Array}
     */
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

    /**
     * Gets the package name from the full service name.
     *
     * @param serviceName
     * @returns {string}
     */
    static getPackageNameOfService(serviceName) {
        let serviceChunks = serviceName.split('.');
        serviceChunks.pop();

        return serviceChunks.join('.');
    }

    /**
     * Gets the actual service name from the full service name.
     *
     * @param serviceName
     * @returns {*}
     */
    static getBaseServiceName(serviceName) {
        let serviceChunks = serviceName.split('.');
        return serviceChunks[serviceChunks.length - 1]
    }
}

module.exports = ServiceDescription;
