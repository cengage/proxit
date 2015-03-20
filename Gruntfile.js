module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            files: ['package.json', 'Gruntfile.js', 'lib/**/*.js', 'test/**/*.js'],
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
        mocha_istanbul: {
            src: 'test',
            options: {
                mask: '**/*-spec.js'
            }
        },
        jsbeautifier: {
            src: '<%= jshint.files %>'
        },
        watch: {
            scripts: {
                files: ['**/*.js'],
                tasks: ['default'],
                options: {
                    spawn: false
                }
            }
        },
        devUpdate: {
            main: {
                options: {
                    updateType: 'force'
                }
            }
        }
    });

    require('load-grunt-tasks')(grunt);

    grunt.registerTask('default', ['devUpdate', 'jshint', 'mochaTest', 'jsbeautifier']);
    grunt.registerTask('coverage',
        "Run coverage.",
        function() {
            grunt.loadNpmTasks('grunt-mocha-istanbul');
            grunt.task.run('mocha_istanbul');
        }
    );
};
