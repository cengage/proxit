var semver = require('semver');

module.exports = function(data) {
    return semver.valid(data) === null ? 'must be a valid semantic version range' : null;
};
