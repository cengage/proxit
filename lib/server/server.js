var config = require('../config'),
    express = require('express'),
    app = express(),
    options = config(),
    log = require('../util/logger'),
    proxit = require('../proxit');

var server = module.exports = {
    config: function() {
        proxit.apply(null, arguments);
        return this;
    },
    use: function() {
        app.use.apply(app, arguments);
        return this;
    },
    start: function() {
        var port = options.port || 9000;

        app.listen(port, function() {
            log.green('Server started on port', port, (options.verbose) ? ' (verbose logging enabled)' : '', '...');
        });
    }
};

server.app = app;

server.use(proxit());
