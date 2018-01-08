"use strict";

const Server = require('./src/Server');
const loadConfig = require('./src/loadConfig');

let servicesConfig = loadConfig('services.yml');

let server = new Server(servicesConfig.services);
server.start();

process.on('SIGINT', function() {
    server.stop().then(() => {
        process.exit();
    }).catch(() => {
        process.exit(1);
    });
});