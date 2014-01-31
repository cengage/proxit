'use strict';

var config = require('./util/config'),
    log = require('./util/logger'),
    path = require('path'),
    url = require('url'),
    express = require('express');

function createPaths() {
    var routes = config.routes,
        keys = config.routes ? Object.keys(routes).sort(function (a, b) {
            return b.length - a.length;
        }) : [],
        paths = [],
        proxyMiddleware = require('./proxy/proxy');

    for (var i = 0; i < keys.length; i++) {
        var endpoints = routes[keys[i]],
            functions = [];

        if (typeof endpoints === 'string') {
            var options = url.parse(endpoints);
            if (options.host) {
                functions.push((function(options, endpoint) {
                    options.route = keys[i];
                    var proxyHandler = proxyMiddleware(options);
                    return function(req, res, next) {
                        var end = res.end;

                        res.end = function() {
                            log.verbose.http(res.statusCode, url.format(url.parse(req.url.replace(options.route, endpoint))) + ' (' + req.url + ')');
                            return end.apply(this,arguments);
                        };

                        proxyHandler(req, res, function() {
                            next();
                        });
                    };
                })(options, endpoints));
            } else {
                functions.push((function() {
                    var dir = path.resolve(path.normalize(endpoints)),
                        route = keys[i],
                        staticHandler = express.static(dir);

                    return function(req, res, next) {
                        var end = res.end,
                            originalUrl = req.url,
                            modifiedUrl;

                        res.end = function() {
                            log.verbose.http(res.statusCode, path.normalize(dir + '/' + modifiedUrl) + ' (' + req.url + ')');
                            return end.apply(this,arguments);
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
                })());
            }
        }

        paths.push({path: keys[i], functions: functions});
    }

    return paths;
}

module.exports = function (newConfig) {
    config(newConfig);

    var paths = createPaths();

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
