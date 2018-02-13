## gRPC for PHP

This is a significantly modified fork of https://github.com/shumkov/grpc-everywhere

### Explanation

PHP is not built to run as a standalone daemon, therefore there is no support for PHP gRPC servers.

We can run a reusable Node.js server to receive gRPC requests, and through FastCGI, pass them to PHP and return the responses. This does not get us all the advantages of gRPC, (no streaming support, and requests still have to be JSON encoded and decoded,) however it does allow us to write PHP "servers" which can later easily be replaced with servers written in other languages. It also gets us strong API typing and allows us to converge on Proto files for API definitions and documentation.

### Current Status

Beta. We intend to follow Semantic Versioning principles.

### Usage

_We use PHP-FPM to receive FastCGI requests and run PHP_

```node
"use strict";

const ON_DEATH          = require('death'); // Enable graceful shutdown
const bole              = require('bole'); // Enable logging, see: https://github.com/rvagg/bole
const log               = require('bole')('grpc-php-adapter');
const grpcPHPAdapter    = require('@compli/grpc-php-adapter');
const gRPCServer        = new grpcPHPAdapter.Server();
const metricsServer     = new grpcPHPAdapter.MetricsServer(); // Enable Prometheus metrics


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


// Prometheus Metrics
metricsServer.start('0.0.0.0:3000', '/metrics'); // Where to listen for Prometheus requests


// Graceful shutdown
ON_DEATH(function(signal, err) {
    metricsServer.stop();
    // healthzServer.stop();
    gRPCServer.stop().then(() => {
        log.info(`Received ${signal} and shutdown the gRPC server`);
        process.exit();
    }).catch(() => {
        log.error(`Received ${signal} but failed shutting down the gRPC server`);
        process.exit(1);
    });
})
```

### Development (using Docker and Docker Compose)

_Contributions are welcome!_

1. Clone the repo and cd into the `development` directory: `git clone git@github.com:Compli/grpc-php-adapter.git && cd development`
2. Run `./bin/local/npm.sh install` to install the NPM modules
3. Run `docker-compose up`
4. Make changes to the code (and test-client if needed,) [nodemon](https://www.npmjs.com/package/nodemon) should pick up your changes and restart the server.
5. Run `docker-compose run --rm --entrypoint node node test-client.js` to execute the test client.

_If you decide to add a NPM package, use `./bin/loca/npm.sh install <package>` from the root of the repo to do so through Docker. This way the modules will be compiled for the right architecture to run in Docker._

