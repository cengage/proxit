var Host = require('./Host'),
    hosts = [],
    hostnames = {};

module.exports = {
    add: function(options) {
        var host = new Host(options);

        host.hostnames.forEach(function(hostname) {
            hostnames[hostname] = host;
        });

        hosts.push(host);
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
    }
};
