'use strict';

var path = require('path');

module.exports = function (grunt) {

    var host = process.env.VCAP_APP_HOST || '0.0.0.0';
    var port = process.env.VCAP_APP_PORT || 9000;
    var JS_DIR = 'public/js';
    var LESS_DIR = 'public/less';

    require('load-grunt-tasks')(grunt);

    // Project Configuration
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        watch: {

            js: {
                files: [JS_DIR + '/**'],
                tasks: ['jshint:all']
            },
            less: {
                files: [LESS_DIR + '/**'],
                tasks: ['less:dev']
            }
        },
        express: {
            options: {
                port: port,
                hostname: host
            },
            livereload: {
                options: {
                    server: path.resolve('./server.js'),
                    livereload: 35730, // use different port to avoid collision with client 'watch' operation
                    serverreload: true,  // this will keep the server running, but may restart at a different port!!!
                    bases: [path.resolve('./server.js')]
                }
            },
            production: {
                options: {
                    server: path.resolve('./multi-tenant/multi-tenant-server.js'),
                    bases: [path.resolve('./multi-tenant/multi-tenant-server.js')]
                }
            },
            multiTenant: {
                options: {
                    server: path.resolve('./server.js'),
                    bases: [path.resolve('./server.js')]
                }
            }


        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'gruntfile.js',
                'public/js/{,**/}*.js',
                '!public/js/vendor/{,**/}*.js',
                '!public/js/vendor-static/{,**/}*.js'
            ]
        },

        less: {
            dev : {
                options : {
                    strictImports : true,
                    sourceMap: true,
                    sourceMapFilename: 'public/css/app/style.css.map',
                    sourceMapURL: 'http://localhost/css/style.css.map'
                },
                files : {
                    'public/css/app/style.css' : 'public/less/theme1/style.less'
                }
            },
            dist : {
                options : {
                    compress: true,
                    strictImports : false,
                    sourceMap: false
                },
                files : {
                    'public/css/app/style.css' : 'public/less/theme1/style.less'
                }
            }
        },

        concurrent: {
            dev: {
                tasks: ['express:livereload', 'watch'],
                options: {
                    logConcurrentOutput: true
                }
            },
            dist: [

            ]
        },

        clean: {
            dist: {
                files: [
                    {
                        dot: true,
                        src: [
                            '.tmp',
                            'dist/*'
                        ]
                    }
                ]
            }
        },

        copy: {
            main: {
                expand: true,
                cwd: 'public/',
                src: ['**', '!js/**', '../index.html', '!scss/**'],
                dest: 'dist/'
            }
        },

        rev: {
            files: {
                src: ['dist/**/*.{js,css}']
            }
        },

        useminPrepare: {
            html: 'index.html'
        },

        usemin: {
            html: ['dist/index.html']
        },

        karma: {
            unit: { configFile: 'config/karma.conf.js', keepalive: true }
            // TODO: get protractor working with grunt
            // e2e: { configFile: 'config/protractor-conf.js', keepalive: true },
            // watch: { configFile: 'test/config/unit.js', singleRun:false, autoWatch: true, keepalive: true }
        },

        uglify: {
            options: {
                report: 'min',
                mangle: false
            }
        }

    });

    grunt.option('force', true);

    grunt.registerTask('expressKeepAlive', ['production:express', 'express-keepalive']);


    // Default task
    grunt.registerTask('default', [
        'jshint',
        'less:dev',
        'concurrent:dev'
    ]);

    grunt.registerTask('testENV', [

    ]);

    grunt.registerTask('production', [
        'expressKeepAlive'
    ]);
    // Build task
    grunt.registerTask('build', [
        'clean:dist',
        'concurrent:dist',
        'copy',
        'useminPrepare',
        'concat',
        'uglify',
        'less:dist',
        'rev',
        'usemin'
    ]);


};
