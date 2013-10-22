module.exports = function(config) {
    config = require('../util/config')(config);

    var connect = require('connect'),
        log = require('../util/logger'),
        port = config.port || 9000;

    connect()
        .use(require('../proxit')())
        .listen(port);

    log.plain('Server started on port', port, (config.verbose) ? ' (verbose logging enabled)' : '', '...');
};
