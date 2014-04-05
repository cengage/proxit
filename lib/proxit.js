var config = require('./util/config'),
    options = config.latest(),
    log = require('./util/logger'),
    path = require('path'),
    url = require('url'),
    express = require('express'),
    proxyMiddleware = require('./proxy/proxy'),
    paths = createPaths();

config.onUpdate(function(newOptions) {
    options = newOptions;
});

function createPaths() {
    var routes = options.routes,
        keys = options.routes ? Object.keys(routes).sort(function (a, b) {
            return b.length - a.length;
        }) : [],
        paths = [];

    for (var i = 0; i < keys.length; i++) {
        var uri = routes[keys[i]],
            functions = [];

        if (typeof uri === 'string') {
            var endpoint = url.parse(uri);
            if (endpoint.host) {
                functions.push(createProxyHandler(keys[i], uri, endpoint));
            } else {
                functions.push(createStaticHandler(keys[i], uri));
            }
        }

        paths.push({path: keys[i], functions: functions});
    }

    return paths;
}

module.exports = function (options) {
    config(options);

    return function (req, res, next) {
        req.url = path.normalize(req.url);

        var pathname = url.parse(req.url).pathname;

        for (var i = 0; i < paths.length; i++) {
            if (pathname.indexOf(paths[i].path) === 0) {
                paths[i].functions[0](req, res, next);
                return;
            }
        }

        next();
    };
};

function createProxyHandler(route, uri, endpoint) {
    endpoint.route = route;
    var proxyHandler = proxyMiddleware(endpoint);
    return function (req, res, next) {
        var end = res.end;

        res.end = function () {
            log.verbose.http(req, res, url.format(url.parse(req.url.replace(endpoint.route, uri))) + ' (' + req.url + ')');
            return end.apply(this, arguments);
        };

        proxyHandler(req, res, function () {
            next();
        });
    };
}

function createStaticHandler(route, uri) {
    var dir = path.resolve(path.normalize(uri)),
        staticHandler = express.static(dir),
        fs = require('fs'),
        stats = fs.statSync(dir);

    if(stats.isFile()) {
        return function(req, res, next) {
            fs.createReadStream(dir).pipe(res);
        };
    } else {
        return function (req, res, next) {
            var end = res.end,
                originalUrl = req.url,
                modifiedUrl;

            res.end = function () {
                log.verbose.http(req, res, path.normalize(dir + '/' + modifiedUrl) + ' (' + req.url + ')');
                return end.apply(this, arguments);
            };

            modifiedUrl = req.url = req.url.replace(route, '') || req.url;

            res.on('error', function (err) {
                next(err);
            });

            staticHandler(req, res, function () {
                req.url = originalUrl;
                next();
            });
        };
    }
}
