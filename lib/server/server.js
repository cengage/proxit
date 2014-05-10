module.exports = function(options) {
    options = require('../config')(options);

    var express = require('express'),
        app = express(),
        log = require('../util/logger'),
        port = options.port || 9000;

    app
        .use(require('../proxit')())
        .listen(port, function() {
            log.green('Server started on port', port, (options.verbose) ? ' (verbose logging enabled)' : '', '...');
        });
};
