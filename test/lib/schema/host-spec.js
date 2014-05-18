var chai = require('chai'),
    expect = chai.expect,
    schemas = require('../../../lib/schemas');

describe('/host schema', function() {
    it('should not allow junk properties', function() {
        invalid({
            turtle: 'a'
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

    it('should allow an array of hostnames to intercept', function() {
        valid({
            hostnames: ['www.mycompany.com'],
            routes: {
                '/': '/somefolder'
            }
        });
    });

    function valid(options) {
        expect(schemas.validate(options, '/host')).to.eql(true);
    }

    function invalid(options) {
        expect(schemas.validate(options, '/host')).to.eql(false);
    }
});
