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
        mocha_istanbul: {
            src: 'test',
            options: {
                mask: '**/*-spec.js',
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
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-jsbeautifier');

    grunt.registerTask('default', ['jshint', 'mochaTest', 'jsbeautifier']);
    grunt.registerTask('coverage',
        "Run coverage.",
        function() {
            grunt.loadNpmTasks('grunt-mocha-istanbul');
            grunt.task.run('mocha_istanbul');
        }
    );
};
