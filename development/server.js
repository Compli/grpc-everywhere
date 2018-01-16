"use strict";

const grpcPHPAdapter = require('grpc-php-adapter');
const ON_DEATH = require('death');
const bole = require('bole'); // enable logging, see: https://github.com/rvagg/bole

bole.output({
  level: 'info',
  stream: process.stdout
});

let server = new grpcPHPAdapter.Server();

let serviceOptions = {
    protoService: 'user.UserService',
    protoFile: './protos/user.proto',
    phpEntrypoint: './public/user.php',
    fastCGIOptions: { // https://www.npmjs.com/package/fastcgi-client
        host: 'php-fpm', // where to reach PHP-FPM
        port: '9000'
    }
}
let service = new grpcPHPAdapter.Service(serviceOptions);
server.addService(service); // Repeat for each protobuf service as needed

server.start('0.0.0.0:50051');

ON_DEATH(function(signal, err) {
    server.stop().then(() => {
        console.log(`Received ${signal} and shutdown the gRPC server`);
        process.exit();
    }).catch(() => {
        console.log(`Received ${signal} but failed shutting down the gRPC server`);
        process.exit(1);
    });
})

