var configs = [],
    byId = {},
    uuid = require('uuid'),
    eventEmitter = new (require('events').EventEmitter)(),
    _ = require('lodash');

var config = module.exports = function (options) {
    if(!options && !configs.length) {
        options = init();
    }
    if(options) {
        options.id = uuid.v4();
        configs.push(options);
        byId[options.id] = options;
        eventEmitter.emit('update', options);
    }
    return config.latest();
};

config.latest = function () {
    return _.last(configs);
};

config.byId = function (id) {
    return byId[id];
};

config.onUpdate = function(cb) {
    eventEmitter.on('update', cb);
};

function init() {
    var initial = {};
    try {
        initial = require(process.cwd() + '/proxit.json');
    } catch (e) {

    }
    initial = require('rc')('proxit', initial);
    return initial;
}