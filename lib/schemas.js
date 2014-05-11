var tv4 = require('tv4').freshApi();

tv4.addSchema('/routes', require('./schema/routes'));
tv4.addSchema('/host', require('./schema/host'));
tv4.addSchema('/config', require('./schema/config'));

tv4.addFormat('semver-range', require('./schema/formats/semver-range'));

module.exports = tv4;
