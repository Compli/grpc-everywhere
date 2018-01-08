const yaml = require('js-yaml');
const fs = require('fs');

function loadConfig(file) {
    let config = fs.readFileSync(file, 'utf8');
    return yaml.safeLoad(config);
}

module.exports = loadConfig;