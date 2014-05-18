var chai = require('chai'),
    expect = chai.expect,
    proxit = require('../../lib/proxit');

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

    it('should have a loadPlugins function', function() {
        expect(proxit.loadPlugins).to.be.a('function');
    });

    it('should return an api that plugins can extend', function() {
        expect(proxit.api).to.be.an('object');
    });

    describe('api', function() {
        var api = proxit.api;

        describe('api.hosts', function() {
            it('should have an "all" function that returns an array of all hosts', function() {
                expect(api.hosts.all().length).to.eql(2);
            });

            describe('byHostname', function() {
                it('should properly return default host', function() {
                    expect(api.hosts.byHostname('*').routes['/']).to.eql('test');
                });

                it('should properly return specific host', function() {
                    expect(api.hosts.byHostname('localhost').routes['/']).to.eql('lib');
                });
            });
        });
    });

});
