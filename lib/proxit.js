var config = require('./config'),
    hosts = require('./hosts'),
    proxy = require('./middleware/proxy');

var proxit = module.exports = function(options) {

    hosts.removeAll();

    config(options);

    if (config.routes) {
        hosts.add({
            hostnames: config.hostnames,
            routes: config.routes
        });
    }

    if (config.hosts) {
        config.hosts.forEach(function(host) {
            hosts.add(host);
        });
    }

    return function(req, res, next) {
        var host = hosts.resolve(req, res);

        if (host) {
            host.resolve(req, res, next);
        }

        next();
    };
};

proxit.api = {
    hosts: hosts,
    proxy: proxy,
    server: require('./server/server')
};
