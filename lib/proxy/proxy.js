var log = require('../util/logger'),
    _ = require('lodash'),
    converter = require('../url/converter'),
    URL = require('url');

module.exports = function(route, endpoint) {
    route = route || '/';

    var to = URL.parse(endpoint),
        httpLib = to.protocol === 'https:' ? 'https' : 'http',
        request = require(httpLib).request;

    return function (req, res, next) {
        var opts = converter.convert(route, req.url, to.href);

        opts.method = req.method;
        opts.headers = to.headers ? _.extend(req.headers, to.headers) : req.headers;

        // Don't count this request against the agent pool...
        opts.agent = false;

        var end = res.end;

        res.end = function () {
            log.verbose.http(req, res, opts.href + ' (' + req.url + ')');
            return end.apply(this, arguments);
        };

        var myReq = request(opts, function (myRes) {

            res.writeHead(myRes.statusCode, myRes.headers);

            myRes.on('error', function (err) {
                log.error('Proxit response error: ' + err.message);
                next(err);
            });

            myRes.pipe(res);
        });

        myReq.setNoDelay(true);

        myReq.on('error', function (err) {
            log.error('Proxit error: ' + err);
            next(err);
        });

        if (!req.readable) {
            myReq.end();
        } else {
            req.pipe(myReq);
        }
    };
};