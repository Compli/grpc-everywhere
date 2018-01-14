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

const grpcPHPAdapter = require('grpc-php-adapter');
const ON_DEATH = require('death');

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
```

### Development (using Docker and Docker Compose)

_Contributions are welcome!_

1. Clone the repo and cd into the `development` directory: `git clone git@github.com:Compli/grpc-php-adapter.git && cd development`
2. Run `./bin/local/npm.sh install` to install the NPM modules
3. Run `docker-compose up`
4. Make changes to the code (and test-client if needed,) [nodemon](https://www.npmjs.com/package/nodemon) should pick up your changes and restart the server.
5. Run `docker-compose run --rm --entrypoint node node test-client.js` to execute the test client.

_If you decide to add a NPM package, use `./bin/loca/npm.sh install <package>` to do it through Docker. This way the modules will be sure to compiled to successfully run in Docker._

