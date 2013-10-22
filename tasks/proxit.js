'use strict';

module.exports = function (grunt) {
    grunt.registerMultiTask('proxit', function () {
        this.async();

        require('../lib/server/server')(this.options({}));
    });

    grunt.ext = grunt.util._.extend((grunt.ext || {}), {
        proxit: require('proxit')
    });
};