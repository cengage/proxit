var log = require('../util/logger'),
    _ = require('lodash'),
    converter = require('../url/converter'),
    interceptors = [],
    URL = require('url'),
    http = require('http'),
    https = require('https');

// Set maxSockets to infinity
httpAgent = new http.Agent();
httpAgent.maxSockets = 10000;
httpsAgent = new https.Agent();
httpAgent.maxSockets = 10000;

var proxy = module.exports = function(route, endpoint) {
    route = route || '/';

    var to = URL.parse(endpoint),
        request = to.protocol === 'https:' ? https.request : http.request,
        agent = to.protocol === 'https:' ? httpsAgent : httpAgent;

    return function(req, res, next) {
        var opts = converter.convert(route, req.url, to.href);

        opts.method = req.method;
        opts.headers = to.headers ? _.extend(req.headers, to.headers) : req.headers;
        opts.agent = agent;

        interceptors.forEach(function(interceptor) {
            interceptor(req, res, opts);
        });

        var end = res.end;

        res.end = function() {
            log.verbose.http(req, res, opts.href + ' (' + req.url + ')');
            return end.apply(this, arguments);
        };

        var myReq = request(opts, function(myRes) {

            res.writeHead(myRes.statusCode, myRes.headers);

            myRes.on('error', function(err) {
                log.error('Proxit response error: ' + err.message);
                next(err);
            });

            myRes.pipe(res);
        });

        myReq.setNoDelay(true);

        myReq.on('error', function(err) {
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

proxy.addInterceptor = function(cb) {
    interceptors.push(cb);
};
