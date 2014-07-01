var hosts = require('./hosts');

module.exports = function(req, res, next) {
    var host = hosts.resolve(req, res);

    if (host) {
        host.resolve(req, res, next);
    }

    next();
};
