"use strict";

const ON_DEATH          = require('death'); // Enable graceful shutdown
const bole              = require('bole'); // Enable logging, see: https://github.com/rvagg/bole
const log               = require('bole')('grpc-php-adapter');
const grpcPHPAdapter    = require('@compli/grpc-php-adapter');
const gRPCServer        = new grpcPHPAdapter.Server();
const metricsServer     = new grpcPHPAdapter.MetricsServer(); // Enable Prometheus metrics
const healthzServer     = new grpcPHPAdapter.HealthzServer(); // Enable Health checks


// Logging
bole.output({
  level: 'info',
  stream: process.stdout
});


// gRPC Server
let serviceOptions = {
    protoService: 'user.UserService',
    protoFile: './protos/user.proto',
    phpEntrypoint: './public/user.php',
    fastCGIOptions: { // https://www.npmjs.com/package/fastcgi-client
        host: 'php-fpm', // Where to reach PHP-FPM
        port: '9000'
    }
}
let service = new grpcPHPAdapter.Service(serviceOptions);
gRPCServer.addService(service); // Repeat for each protobuf service as needed
gRPCServer.start('0.0.0.0:50051'); // Where to listen for gRPC requests

// Health checks
healthzServer.start('0.0.0.0:4000', serviceOptions.fastCGIOptions); // Where to listen for Health check requests

// Prometheus Metrics
metricsServer.start('0.0.0.0:3000', '/metrics'); // Where to listen for Prometheus requests

// Graceful shutdown
ON_DEATH(function(signal, err) {
    metricsServer.stop();
    healthzServer.stop();
    gRPCServer.stop().then(() => {
        log.info(`Received ${signal} and shutdown the gRPC server`);
        process.exit();
    }).catch(() => {
        log.error(`Received ${signal} but failed shutting down the gRPC server`);
        process.exit(1);
    });
})

