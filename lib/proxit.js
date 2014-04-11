var config = require('./util/config'),
    log = require('./util/logger'),
    path = require('path'),
    URL = require('url'),
    express = require('express'),
    proxyMiddleware = require('./proxy/proxy');

function createPaths() {
    var routes = config.routes,
        keys = routes ? Object.keys(routes).sort(function (a, b) {
            return b.length - a.length;
        }) : [],
        paths = [];

    for (var i = 0; i < keys.length; i++) {
        var endpoint = routes[keys[i]],
            functions = [];

        if (typeof endpoint === 'string') {
            if (URL.parse(endpoint).host) {
                functions.push(createProxyHandler(keys[i], endpoint));
            } else {
                functions.push(createStaticHandler(keys[i], endpoint));
            }
        }

        paths.push({path: keys[i], functions: functions});
    }

    return paths;
}

module.exports = function (options) {
    config(options);

    var paths = createPaths();

    return function (req, res, next) {
        req.url = path.normalize(req.url);

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

function createProxyHandler(route, url) {
    return proxyMiddleware(route, url);
}

function createStaticHandler(route, uri) {
    var dir = path.resolve(path.normalize(uri)),
        staticHandler = express.static(dir),
        fs = require('fs'),
        stats = fs.statSync(dir);

    if(stats.isFile()) {
        return function(req, res, next) {
            var end = res.end;
            res.end = function () {
                log.verbose.http(req, res, path.normalize(dir) + ' (' + req.url + ')');
                return end.apply(this, arguments);
            };
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
