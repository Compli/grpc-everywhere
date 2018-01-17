const log                   = require('bole')('grpc-php-adapter');
const koa                   = require('koa');
const promClient            = require('prom-client');
const register              = require('prom-client/lib/registry').globalRegistry;
const collectDefaultMetrics = promClient.collectDefaultMetrics;

// Probe every 5th second.
collectDefaultMetrics({ timeout: 5000 });

class MetricsServer {

    constructor() {
        this.koaApp = new koa();
    }

    /**
     * Start the Metrics server
     *
     * @param connectionString
     * @param httpPath
     */
    start(connectionString, httpPath) {
        this.koaApp.use(ctx => {
            if (ctx.request.path == httpPath) {
                ctx.body = register.metrics();
                ctx.type = "text/html";
                log.debug(`Served metrics on ${connectionString}`);
            }
        });
        this.koaApp.listen(connectionString.split(':')[1], connectionString.split(':')[0]);
        log.info('Metrics server started');
    }

    /**
     * Stop the Metrics server
     */
    stop() {
        this.koaApp.close();
        log.info('Metrics server shutdown');
    }

}

module.exports = MetricsServer;

