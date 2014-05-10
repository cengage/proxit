var chai = require('chai'),
    expect = chai.expect,
    schema = require('../../lib/config-schema'),
    tv4 = require('tv4'),
    schemaUrl = '/proxit/config';

tv4.addSchema(schemaUrl, schema);

describe('config-schema', function() {
    it('should allow port', function() {
        valid({
            port: 9000
        });
    });

    it('should not allow a non numeric port', function() {
        invalid({
            port: 'a'
        });
    });

    it('should not allow junk properties', function() {
        invalid({
            turtle: 'a'
        });
    });

    it('should support verbose flag set to true', function() {
        valid({
            verbose: true
        });
    });

    it('should support verbose flag set to false', function() {
        valid({
            verbose: false
        });
    });

    it('should not allow non boolean data for verbose flag', function() {
        invalid({
            verbose: 1
        });
    });

    it('should allow a routes object with string values', function() {
        valid({
            routes: {
                '/': 'someurl'
            }
        });
    });

    it('should not allow a routes object with non-string values', function() {
        invalid({
            routes: {
                '/': {}
            }
        });
    });

    it('should not allow an empty routes object', function() {
        invalid({
            routes: {

            }
        });
    });

    function valid(options) {
        expect(tv4.validate(options, schemaUrl)).to.eql(true);
    }

    function invalid(options) {
        expect(tv4.validate(options, schemaUrl)).to.eql(false);
    }
});
