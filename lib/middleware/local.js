var log = require('../util/logger'),
    path = require('path'),
    express = require('express');

module.exports = function(route, uri) {
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
};
