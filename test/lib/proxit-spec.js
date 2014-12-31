var chai = require('../chai'),
    expect = chai.expect,
    http = require('http'),
    https = require('https'),
    proxit = require('../../lib/proxit'),
    proxy = require('../../lib/middleware/proxy'),
    converter = require('../../lib/url/converter');

describe('proxit', function() {

    beforeEach(function() {
        proxit({
            routes: {
                '/': 'test'
            },
            hosts: [{
                hostnames: ['localhost'],
                routes: {
                    '/': 'lib'
                }
            }]
        });
    });

    it('should return an api that plugins can extend', function() {
        expect(proxit.api).to.be.an('object');
    });

    describe('api', function() {
        var api = proxit.api;

        describe('hosts', function() {
            describe('all', function() {
                it('should return an array of all hosts', function() {
                    expect(api.hosts.all().length).to.eql(2);
                });
            });
        });

        describe('proxy', function() {

            it('should return the raw proxy middleware', function() {
                expect(api.proxy).to.eql(proxy);
            });

            it('should return the raw converter module', function() {
                expect(api.converter).to.eql(converter);
            });

            describe('addInterceptor', function() {
                // TODO: perform actual proxy call
                it('should invoke callback on proxy calls', function() {
                    var spy = chai.spy();
                    api.proxy.addInterceptor(spy);
                });
            });
        });
    });

});
