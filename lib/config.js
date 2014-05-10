var fs = require('fs'),
    _ = require('lodash'),
    rc = require('rc'),
    path = require('path');

module.exports = function(config) {
    init(config);

    return module.exports;
};

function init(config) {
    var key;

    if (!config) {
        if (fs.existsSync(process.cwd() + path.sep + 'proxit.json')) {
            config = require(process.cwd() + path.sep + 'proxit.json');
        }
        config = rc('proxit', config);
    }

    if (config) {
        clean(module.exports);

        config = _.pick(config, 'port', 'verbose', 'routes');

        for (key in config) {
            module.exports[key] = config[key];
        }
    }
}

function clean(obj) {
    for (var key in obj) {
        delete obj[key];
    }
}

init();
