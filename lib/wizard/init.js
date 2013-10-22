var fs = require('fs'),
    log = require('../util/logger');

module.exports = function() {
    fs.writeFileSync('proxit.json', fs.readFileSync(__dirname + '/../../proxit.json'));
    log.plain('Simply customize the "proxit.json" file we\'ve created in your current directory then run "proxit".');
};
