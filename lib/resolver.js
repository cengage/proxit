var hosts = require('./hosts'),
    URL = require('url');

module.exports = function(req, res, next) {
    var host = hosts.resolve(req, res);

    if (host && host.paths) {
        var paths = host.paths,
            pathname = URL.parse(req.url).pathname;

        for (var i = 0; i < paths.length; i++) {
            if (pathname.indexOf(paths[i].path) === 0) {
                paths[i].functions[0](req, res, next);
                return;
            }
        }
    }

    next();
};
