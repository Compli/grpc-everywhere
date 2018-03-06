const log               = require('bole')('grpc-php-adapter');
const koa               = require('koa');
const fcgiClient        = require('fastcgi-client');
const ip                = require('ip');

const ipAddress = ip.address();

class HealthzServer {

    constructor() {
        this.koaApp = new koa();
        this.server = null;
    }

    /**
     * Start the Healthz server
     *
     * @param connectionString
     */
    start(connectionString, fastCGIOptions) {
        let fcgiParams = {
            SCRIPT_FILENAME: '/ping',
            REQUEST_METHOD: 'GET',
            REQUEST_URI: '/ping',
            SERVER_PROTOCOL: 'HTTP/1.1',
            SERVER_ADDR: fastCGIOptions.host,
            SERVER_PORT: fastCGIOptions.port,
            SERVER_NAME: fastCGIOptions.host,
            SERVER_SOFTWARE: 'GRPC everywhere',
            REMOTE_ADDR: ipAddress,
            REMOTE_PORT: 0,
            GATEWAY_INTERFACE: 'CGI/1.1',
            REDIRECT_STATUS: 200
        }
        this.koaApp.use(async (ctx) => {
            switch(ctx.request.path){
                case "/healthz/liveness":
                    ctx.body = { "status": "success" };
                    log.debug(`Served liveness check on ${connectionString}`);
                    break;
                case "/healthz/readiness":
                    let client = fcgiClient({ host: fastCGIOptions.host, port: fastCGIOptions.port });
                    client.on('error', function (err) {
                        ctx.body = { "status": "error", "data": { "php-fpm": false } };
                        ctx.status = 500;
                        log.debug(`Error with readiness check on ${connectionString}`);
                        log.debug(err);
                    });
                    await new Promise((resolve) => {
                        client.on('ready', function () {
                            client.request(fcgiParams, function (err, request) {
                                if (!err) {
                                    ctx.body = { "status": "success", "data": { "php-fpm": true } };
                                }
                                resolve();
                                log.debug(`Served readiness check on ${connectionString}`);
                            });
                        });
                    });
                    break;
                default:
                    break;
            }
        });
        this.server = this.koaApp.listen(connectionString.split(':')[1], connectionString.split(':')[0]);
        log.info('Healthz server started');
    }

    /**
     * Stop the Healthz server
     */
    stop() {
        this.server.close();
        log.info('Healthz server shutdown');
    }

}

module.exports = HealthzServer;

