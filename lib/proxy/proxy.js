var log = require('../util/logger'),
    owns = {}.hasOwnProperty;

module.exports = function(options) {
    options = options || {};
    options.route = options.route || '/';

    var httpLib = options.protocol === 'https:' ? 'https' : 'http',
        request = require(httpLib).request;

    return function (req, resp, next) {
        var route = slashJoin(options.route),
            url = slashJoin(req.url);

        if (url.slice(0, route.length) === route) {
            url = url.slice(route.length);
        } else {
            return next();
        }

        //options for this request
        var opts = extend({}, options);
        opts.path = slashJoin(options.pathname, url);
        opts.method = req.method;
        opts.headers = options.headers ? merge(req.headers, options.headers) : req.headers;

        // Don't count this request against the agent pool...
        opts.agent = false;

        var myReq = request(opts, function (myRes) {

            resp.writeHead(myRes.statusCode, myRes.headers);

            myRes.on('error', function (err) {
                log.error('Proxit response error: ' + err.message);
                next(err);
            });

            myRes.pipe(resp);
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

function slashJoin(p1, p2) {
    var pathJoinChar = '/';
    if (p1.length && p1[p1.length - 1] === pathJoinChar) {
        p1 = p1.substring(0, p1.length - 1);
    }
    if (p2 && p2.length && p2[0] === pathJoinChar) {
        p2 = p2.substring(1);
    }
    if (p1.length && p1.indexOf('?') > -1) {
        p1 = p1.replace('?', '/?');
        pathJoinChar = '';
    }
    return p1 + ((p2)? pathJoinChar + p2 : '');
}

function extend(obj, src) {
    for (var key in src) if (owns.call(src, key)) obj[key] = src[key];
    return obj;
}

function merge(src1, src2) {
    var merged = {};
    extend(merged, src1);
    extend(merged, src2);
    return merged;
}
