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
        var hostname = getHostname(req),
            host = hosts.byHostname(hostname) || hosts.byHostname('*'),
            paths = host.paths;

        var pathname = URL.parse(req.url).pathname;

        for (var i = 0; i < paths.length; i++) {
            if (pathname.indexOf(paths[i].path) === 0) {
                paths[i].functions[0](req, res, next);
                return;
            }
        }

        next();
    };
};

proxit.api = {
    hosts: hosts,
    proxy: proxy,
    server: {
        start: require('./server/server')
    }
};

function getHostname(req) {
    var host = req.headers.host;
    if (!host) {
        return '*';
    }
    return host.split(':')[0];
}
