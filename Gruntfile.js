module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            files: ['gruntfile.js', 'lib/**/*.js', 'test/**/*.js'],
            options: {
                globals: {
                    console: true,
                    require: true
                }
            }
        },
        mochaTest: {
            options: {
                reporter: 'spec'
            },
            src: ['test/**/*-spec.js']
        },
        jsbeautifier: {
            src: '<%= jshint.files %>'
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-jsbeautifier');

    grunt.registerTask('default', ['jshint', 'mochaTest', 'jsbeautifier']);
};
