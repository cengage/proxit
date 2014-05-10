var chai = require('chai'),
    npm = require('../../lib/util/npm'),
    expect = chai.expect,
    pkg = require('../../package.json');

describe('npm', function() {
    describe('installed', function() {
        it('should be able to recognize when a module is installed', function() {
            expect(npm.installed('grunt')).to.eql(true);
        });

        it('should be able to recognize when a module is not installed', function() {
            expect(npm.installed('someothermodule')).to.eql(false);
        });

        it('should be able to determine when a module matches a version range', function() {
            expect(npm.installed('grunt', pkg.devDependencies.grunt)).to.eql(true);
        });

        it('should be able to determine when a module does not match a version range', function() {
            expect(npm.installed('grunt', '0.0.0')).to.eql(false);
        });
    });
});
