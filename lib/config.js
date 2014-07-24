var fs = require('fs'),
    _ = require('lodash'),
    rc = require('rc'),
    path = require('path'),
    schemas = require('./schemas'),
    props = Object.keys(require('./schema/config').properties);


var config = module.exports = function(options) {
    var key;

    if (!options) {
        if (fs.existsSync(process.cwd() + path.sep + 'proxit.json')) {
            options = require(process.cwd() + path.sep + 'proxit.json');
        }
        options = _.pick(rc('proxit', options), props);
    }

    if (Object.keys(options).length > 0) {
        clean(config);

        if (!schemas.validate(options, '/config')) {
            throw 'Invalid configuration: ' + JSON.stringify(options);
        }


        for (key in options) {
            config[key] = options[key];
        }
    }

    setMaxSockets(config.maxSockets);

    return config;
};

function clean(obj) {
    for (var key in obj) {
        delete obj[key];
    }
}

function setMaxSockets(maxSockets) {
    require('http').globalAgent.maxSockets = require('https').globalAgent.maxSockets = maxSockets || 20000;
}

config();
