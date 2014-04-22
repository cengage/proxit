module.exports = function(config) {
    options = require('../util/config')(config);

    var express = require('express'),
        app = express(),
        log = require('../util/logger'),
        port = options.port || 9000;

    app
        .use(require('../proxit')(config))
        .listen(port, function() {
            log.green('Server started on port', port, (options.verbose) ? ' (verbose logging enabled)' : '', '...');
        });
};
