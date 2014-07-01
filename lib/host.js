var proxy = require('./middleware/proxy'),
    local = require('./middleware/local'),
    URL = require('url');

var Host = module.exports = function(options) {
    var routes = this.routes = options.routes,
        keys = routes ? Object.keys(routes).sort(function(a, b) {
            return b.length - a.length;
        }) : [];

    this.hostnames = options.hostnames || ['*'];
    this.paths = [];

    for (var i = 0; i < keys.length; i++) {
        var endpoint = routes[keys[i]],
            functions = [];

        if (typeof endpoint === 'object') {
            endpoint = endpoint.url;
        }

        if (typeof endpoint === 'string') {
            if (URL.parse(endpoint).host) {
                functions.push(proxy(keys[i], endpoint));
            } else {
                functions.push(local(keys[i], endpoint));
            }
        }

        this.paths.push({
            path: keys[i],
            functions: functions
        });
    }
};
