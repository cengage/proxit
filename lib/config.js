var fs = require('fs'),
    _ = require('lodash'),
    rc = require('rc'),
    path = require('path'),
    schema = require('./config-schema'),
    tv4 = require('tv4').freshApi();

tv4.addSchema('/proxit/config', schema);

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

        if (!tv4.validate(options, '/proxit/config')) {
            throw 'Configuration is invalid.';
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
