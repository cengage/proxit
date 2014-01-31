module.exports = function(config) {
    config = require('../util/config')(config);

    var express = require('express'),
        app = express(),
        log = require('../util/logger'),
        port = config.port || 9000;

    app
        .use(require('../proxit')())
        .listen(port);

    log.plain('Server started on port', port, (config.verbose) ? ' (verbose logging enabled)' : '', '...');
};
