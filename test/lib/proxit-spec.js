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

    describe('API', function() {
        it('should have an createHost function', function() {
            expect(proxit.api.createHost).to.be.a('function');
        });

        it('should have a deleteHost function', function() {
            expect(proxit.api.deleteHost).to.be.a('function');
        });
    });
});
