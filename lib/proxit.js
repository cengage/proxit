var config = require('./config'),
    log = require('./util/logger'),
    path = require('path'),
    URL = require('url'),
    express = require('express'),
    proxyMiddleware = require('./proxy/proxy'),
    hosts = [],
    hostnames = {};

function setupHost(host) {
    var routes = host.routes,
        keys = routes ? Object.keys(routes).sort(function(a, b) {
            return b.length - a.length;
        }) : [];

    host.hostnames = host.hostnames || ['*'];
    host.paths = [];

    host.hostnames.forEach(function(hostname) {
        hostnames[hostname] = host;
    });

    hosts.push(host);

    for (var i = 0; i < keys.length; i++) {
        var endpoint = routes[keys[i]],
            functions = [];

        if (typeof endpoint === 'object') {
            endpoint = endpoint.url;
        }

        if (typeof endpoint === 'string') {
            if (URL.parse(endpoint).host) {
                functions.push(createProxyHandler(keys[i], endpoint));
            } else {
                functions.push(createStaticHandler(keys[i], endpoint));
            }
        }

        host.paths.push({
            path: keys[i],
            functions: functions
        });
    }

    return host;
}

var proxit = module.exports = function(options) {
    hosts = [];
    hostnames = {};

    config(options);

    if (config.routes) {
        setupHost({
            hostnames: config.hostnames,
            routes: config.routes
        });
    }

    if (config.hosts) {
        config.hosts.forEach(function(host) {
            setupHost(host);
        });
    }

    this.middleware = function(req, res, next) {
        var hostname = getHostname(req),
            host = hostnames[hostname] || hostnames['*'],
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

    return this.middleware;
};

proxit.api = {
    host: function() {

    },
    hosts: function() {
        return hosts;
    }
};

proxit.loadPlugins = function() {

};

function getHostname(req) {
    var host = req.headers.host;
    if (!host) {
        return '*';
    }
    return host.split(':')[0];
}

function createProxyHandler(route, url) {
    return proxyMiddleware(route, url);
}

function createStaticHandler(route, uri) {
    var dir = path.resolve(path.normalize(uri)),
        staticHandler = express.static(dir),
        fs = require('fs'),
        stats = fs.statSync(dir);

    if (stats.isFile()) {
        return function(req, res, next) {
            var end = res.end;
            res.end = function() {
                log.verbose.http(req, res, path.normalize(dir) + ' (' + req.url + ')');
                return end.apply(this, arguments);
            };
            fs.createReadStream(dir).pipe(res);
        };
    } else {
        return function(req, res, next) {
            var end = res.end,
                originalUrl = req.url,
                modifiedUrl;

            res.end = function() {
                log.verbose.http(req, res, path.normalize(dir + '/' + modifiedUrl) + ' (' + req.url + ')');
                return end.apply(this, arguments);
            };

            modifiedUrl = req.url = req.url.replace(route, '') || req.url;

            res.on('error', function(err) {
                next(err);
            });

            staticHandler(req, res, function() {
                req.url = originalUrl;
                next();
            });
        };
    }
}
