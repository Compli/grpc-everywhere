"use strict";

const path = require('path');
const ip = require('ip');
const queryString = require('querystring');
const log = require('bole')('grpc-php-adapter');

const ConnectorError = require('./error/ConnectorError');
const ScriptError = require('./error/ScriptError');

const fastCgiConnector = require('fastcgi-client');

const ipAddress = ip.address();

class FastCgiConnector {

    constructor(phpEntrypoint, fastCGIOptions) {
        this.phpEntrypoint = phpEntrypoint;
        this.fastCGIOptions = fastCGIOptions;

        this.phpEntrypoint = FastCgiConnector.normalizeScriptPath(this.phpEntrypoint);
        this.fastCGIOptions.skipCheckServer = true;

        this.client = fastCgiConnector(this.fastCGIOptions);

        this.ready = new Promise((resolve, reject) => {
            this.client.on('ready', resolve);
            this.client.on('error', reject);
        });

        this.client.on('error', (error) => {
            log.error(error);
        });

        this.lastRequestPromise = null;
    }

    /**
     * @param {Object} params
     * @param {string} message
     * @returns {Promise}
     */
    send(params, message) {
        let cgiParams = this.prepareCgiParams(params, message);

        this.lastRequestPromise = new Promise((resolve, reject) => {
            this.client.request(cgiParams, (error, request) => {

                if (error !== null) {
                    return reject(new ConnectorError(error));
                }

                let stdout = '', stderr = '';
                request.stdout.on('data', (data) => {
                    stdout += data.toString('utf8');
                });

                request.stderr.on('data', (data) => {
                    stderr += data.toString('utf8');
                });

                request.stdout.on('end', () => {
                    if (stderr.length) {
                        return reject(new ScriptError(stderr));
                    }

                    resolve(
                        FastCgiConnector.removeHeaders(stdout)
                    );
                });

                request.stdin.end(message);
            });
        });

        return this.lastRequestPromise;
    }

    /**
     * @private
     * @param params
     * @param message
     * @returns {Object}
     */
    prepareCgiParams(params, message) {
        const requestUri = `/grpc/${params.packageName}/${params.serviceName}/${params.methodName}`;
        const query = queryString.stringify(params);

        return {
            SCRIPT_FILENAME: this.phpEntrypoint,
            SCRIPT_NAME: path.basename(this.phpEntrypoint),
            CONTENT_LENGTH: message.length,
            CONTENT_TYPE: 'application/json',
            REQUEST_METHOD: 'POST',
            REQUEST_URI: requestUri + '?' + query,
            QUERY_STRING: query,
            DOCUMENT_URI: requestUri,
            DOCUMENT_ROOT: process.cwd(),
            SERVER_PROTOCOL: 'HTTP/1.1',
            SERVER_ADDR: this.fastCGIOptions.host,
            SERVER_PORT: this.fastCGIOptions.port,
            SERVER_NAME: this.fastCGIOptions.host,
            SERVER_SOFTWARE: 'GRPC everywhere',
            REMOTE_ADDR: ipAddress,
            REMOTE_PORT: 0,
            GATEWAY_INTERFACE: 'CGI/1.1',
            REDIRECT_STATUS: 200
        }
    }

    /**
     * @private
     * @param {string} response
     * @returns {string}
     */
    static removeHeaders(response) {
        return response.replace(/^[\s\S]*?\r\n\r\n/, '');
    }

    /**
     * @private
     * @param {string} script
     * @returns {string}
     */
    static normalizeScriptPath(script) {
        if (path.isAbsolute(script)) {
            return script;
        }

        return path.join(process.cwd(), script);
    }
}

module.exports = FastCgiConnector;

