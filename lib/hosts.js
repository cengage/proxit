var Host = require('./host'),
    hosts = [],
    hostnames = {};

module.exports = {
    add: function(options) {
        var host = new Host(options);

        host.hostnames.forEach(function(hostname) {
            hostnames[hostname] = host;
        });

        hosts.push(host);

        return host;
    },
    byHostname: function(hostname) {
        return hostnames[hostname];
    },
    all: function() {
        return hosts;
    },
    removeAll: function() {
        hosts = [];
        hostnames = {};
    },
    resolve: function(req, res) {
        var hostname = getHostname(req);

        return this.byHostname(hostname) || this.byHostname('*');
    }
};

function getHostname(req) {
    var host = req.headers.host;
    if (!host) {
        return '*';
    }
    return host.split(':')[0];
}
