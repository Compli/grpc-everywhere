"use strict";

const Server = require('./src/Server');
const loadConfig = require('./src/loadConfig');

let config = loadConfig('config.yml');

if (!Array.isArray(config)) {
    config = [config];
}

let server = new Server(config);
server.start();

process.on('SIGINT', function() {
    server.stop().then(() => {
        process.exit();
    }).catch(() => {
        process.exit(1);
    });
});