module.exports = function (grunt) {
    'use strict';
    grunt.initConfig({
        uglify: {
            main: {
                options: {
                    preserveComments: 'some'
                },
                files: {
                    'dist/ng-stomp.min.js': ['src/ng-stomp.js'],
                    'dist/ng-stomp.standalone.min.js': [
                        'bower_components/sockjs-client/dist/sockjs.min.js',
                        'bower_components/stomp-websocket/lib/stomp.min.js',
                        'src/ng-stomp.js'
                    ]
                }
            }
        },
        standard: {
            options: {
                format: true
            },
            app: {
                src: ['ng-stomp.js']
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: {
                src: [
                    'Gruntfile.js',
                    'src/ng-stomp.js'
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.registerTask('default', ['jshint', 'uglify']);
};
