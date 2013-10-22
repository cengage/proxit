#!/usr/bin/env node

var init = require('./lib/wizard/init'),
    options = require('./lib/util/options'),
    server = require('./lib/server/server');

if (options.init) {
    init();
}
else {
    server();
}
