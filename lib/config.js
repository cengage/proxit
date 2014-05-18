var fs = require('fs'),
    _ = require('lodash'),
    rc = require('rc'),
    path = require('path'),
    schemas = require('./schemas');

var config = module.exports = function(options) {
    var key;

    if (!options) {
        if (fs.existsSync(process.cwd() + path.sep + 'proxit.json')) {
            options = require(process.cwd() + path.sep + 'proxit.json');
        }
        options = rc('proxit', options);
    }

    if (options) {
        clean(config);

        // Clear out crud that rc adds
        options = _.omit(options, 'config', '_');

        if (!schemas.validate(options, '/config')) {
            throw 'Invalid configuration: ' + JSON.stringify(options);
        }


        for (key in options) {
            config[key] = options[key];
        }
    }

    return config;
};

function clean(obj) {
    for (var key in obj) {
        delete obj[key];
    }
}

config();
