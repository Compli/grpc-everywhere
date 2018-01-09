const fs = require('fs');

function createConnector(name, config) {
    let connectorFile;
    for (let filePath of [`${__dirname}/${name}Connector`, name]) {
        if (fs.existsSync(`${filePath}.js`)) {
            connectorFile = filePath;
            break;
        }
    }

    if (connectorFile === null) {
        throw new Error(`Wrong connector: ${name}`);
    }

    const Connector = require(connectorFile);

    return new Connector(config);
}

module.exports = createConnector;