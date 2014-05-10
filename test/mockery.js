var mockery = require('mockery'),
    _ = require('lodash');

module.exports = _.extend(mockery, {
    setup: function(options) {
        this.options = options || {};

        this.enable(options.enable);

        if (options.mock) {
            this.registerMocks(options.mock);
        }

        if (options.allow) {
            this.registerAllowables(options.allow);
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
