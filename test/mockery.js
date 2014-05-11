var mockery = require('mockery'),
    _ = require('lodash');

mockery.warnOnUnregistered(false);

module.exports = _.extend(mockery, {
    setup: function(options) {
        options = options || {};

        this.enable();

        if (options.mock) {
            this.registerMocks(options.mock);
        }

        if (options.allow) {
            options.allow.forEach(function(allowable) {
                mockery.registerAllowable(allowable, true);
            });
        }

    },
    registerMocks: function(mocks) {
        for (var key in mocks) {
            this.registerMock(key, mocks[key]);
        }
    },
    teardown: function() {
        this.deregisterAll();
        this.disable();
    }
});
