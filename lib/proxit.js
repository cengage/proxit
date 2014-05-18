var config = require('./config'),
    hosts = require('./hosts'),
    proxy = require('./middleware/proxy'),
    URL = require('url');

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
        var host = hosts.resolve(req, res),
            pathname = URL.parse(req.url).pathname;

        if (host && host.paths) {
            var paths = host.paths;

            for (var i = 0; i < paths.length; i++) {
                if (pathname.indexOf(paths[i].path) === 0) {
                    paths[i].functions[0](req, res, next);
                    return;
                }
            }
        }

        next();
    };
};

proxit.api = {
    hosts: hosts,
    proxy: proxy,
    server: require('./server/server')
};
