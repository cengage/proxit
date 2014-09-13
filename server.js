#!/usr/bin/env node

var cluster = require('cluster'),
    os = require('os'),
    server = require('./lib/server/server');

if(cluster.isMaster) {
    for(var i = 0; i < os.cpus().length; i++) {
        cluster.fork();
    }
} else {
    server.start();
}
