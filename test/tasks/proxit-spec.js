var expect = require('chai').expect,
    sut = require('../../tasks/proxit'),
    request = require('request'),
    _ = require('lodash'),
    proxitCallback,
    port = 10101;


describe('Grunt task', function() {

    var grunt = {
        registerMultiTask: function(task, callback) {
            if (task === 'proxit') {
                proxitCallback = callback;
            }
        },
        util: {
            _: _
        }
    };

    beforeEach(function() {
        sut(grunt);
    });

    it('should return a successful response from a proxit request', function(done) {
        invokeProxitCallback();

        request('http://localhost:' + port, function(err, res, body) {

            expect(res.statusCode).to.equal(200);

            done();
        });

    });
});

function invokeProxitCallback() {
    proxitCallback.call({
        async: function() {

        },
        options: function() {
            return {
                port: port,
                verbose: true,
                hosts: [{
                    routes: {
                        '/': 'http://nodejs.org/'
                    }
                }]
            };
        }
    });
}
