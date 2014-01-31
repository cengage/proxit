var log = require('../util/logger'),
    owns = {}.hasOwnProperty;

module.exports = function(options) {
    options = options || {};
    options.route = options.route || '/';

    var httpLib = options.protocol === 'https:' ? 'https' : 'http',
        request = require(httpLib).request;

    return function (req, resp, next) {
        var route = slashJoin(options.route, ''),
            url = req.url;

        if (slashJoin(url, '').slice(0, route.length) === route) {
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

        applyViaHeader(req.headers, opts, opts.headers);

        // Forwarding the host breaks dotcloud
        delete opts.headers["host"];

        var myReq = request(opts, function (myRes) {
            applyViaHeader(myRes.headers, opts, myRes.headers);

            // rewrite location
            if (myRes.headers.location) {
                myRes.headers.location = myRes.headers.location.replace(options.protocol + '//' + options.host, '').replace(options.pathname, options.route);
            }

            resp.writeHead(myRes.statusCode, myRes.headers);

            myRes.on('error', function (err) {
                log.error('Proxit response error: ' + err.message);
                next(err);
            });

            myRes.pipe(resp);
        });

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

function applyViaHeader(existingHeaders, opts, applyTo) {

    if (!opts.via) {
        return;
    }

    var viaName = (true === opts.via) ?
        // use the host name
        require('os').hostname() :
        // or use whatever was passed as the options.via value
        opts.via;

    var viaHeader = '1.1 ' + viaName;

    if (existingHeaders.via) {
        viaHeader = existingHeaders.via + ', ' + viaHeader;
    }

    applyTo.via = viaHeader;
}

function slashJoin(p1, p2) {
    if (p1.length && p1[p1.length - 1] === '/') {
        p1 = p1.substring(0, p1.length - 1);
    }
    if (p2.length && p2[0] === '/') {
        p2 = p2.substring(1);
    }
    return p1 + '/' + p2;
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
