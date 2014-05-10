var path = require('path'),
    semver = require('semver');

module.exports = {
    installed: function(name, version) {
        var moduleId = process.cwd() + path.sep + 'node_modules' + path.sep + name + path.sep + 'package.json';
        try {
            var pkg = require(moduleId);

            if (version && !semver.satisfies(pkg.version, version)) {
                return false;
            }

            return true;
        } catch (e) {
            return false;
        }
    }
};
