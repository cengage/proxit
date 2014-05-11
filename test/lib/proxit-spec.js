var chai = require('chai'),
    expect = chai.expect,
    proxit = require('../../lib/proxit');

describe('proxit', function() {

    it('should have a loadPlugins function', function() {
        expect(proxit.loadPlugins).to.be.a('function');
    });

    it('should return an api that plugins can extend', function() {
        expect(proxit.api).to.be.an('object');
    });

    describe('api', function() {
        beforeEach(function() {
            proxit({
                routes: {
                    '/': 'test'
                }
            });
        });

        describe('host', function() {
            it('should return undefined if no params passed', function() {
                expect(proxit.api.host()).to.eql(undefined);
            });
        });

        describe('hosts', function() {
            it('should return the array of hosts', function() {
                expect(proxit.api.hosts().length).to.eql(1);
            });
        });
    });

});
