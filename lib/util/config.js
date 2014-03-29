function init(config) {
    if(!config) {
        try {
            config = require(process.cwd() + '/' + (require('./options').proxitFile || 'proxit.json'));
        } catch(e) {
        }
    }

    if(config) {
        for (var key in module.exports) {
            delete module.exports[key];
        }

        for (key in config) {
            module.exports[key] = config[key];
        }
    }
}

module.exports = function(config) {
    init(config);

    return module.exports;
};

init();