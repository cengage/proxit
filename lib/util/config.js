module.exports = function(config) {
    init(config);

    return module.exports;
};

function init(config) {
    var key;

    if(!config) {
        try {
            config = require(process.cwd() + '/proxit.json');
        } catch(e) {
        }
        config = require('rc')('proxit', config);
    }

    if(config) {
        for (key in module.exports) {
            delete module.exports[key];
        }

        for (key in config) {
            module.exports[key] = config[key];
        }
    }
}

init();