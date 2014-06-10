'use strict';

var path = require('path');

module.exports = function(grunt) {

    var host = process.env.VCAP_APP_HOST || '0.0.0.0';
    var port = process.env.VCAP_APP_PORT || 9000;
    var CSS_DIR = 'public/css',

        IMG_DIR = 'public/img',
        JS_DIR = 'public/js';

    require('load-grunt-tasks')(grunt);


    // Project Configuration
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        watch: {

            js: {
                files: [JS_DIR + '/**'],
                tasks: ['jshint:all']
                /*,
                options: {
                    livereload: 35731
                } */
            } /*,
            css: {
                files: [CSS_DIR + '/**']
                options: {
                    livereload: 35732
                }
            },
            compass: {
                files: [SCSS_DIR + '/**'],
                tasks: ['compass:dev']
            } */
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
                    serverreload: true,
                    bases: [path.resolve('./server.js')]
                }
            }/*,
            test: {
                options: {
                    server: path.resolve('./server'),
                    bases: [path.resolve('./.tmp'), path.resolve(__dirname, 'test')]
                }
            },
            dist: {
                options: {
                    server: path.resolve('./server'),
                    bases: path.resolve(__dirname, yeomanConfig.dist)
                }
            } */
        },
        open: {
            server: {
                url: 'http://localhost:<%= express.options.port %>'
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
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        'dist/*'
                    ]
                }]
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
        },
        ngconstant: {
      // Options for all targets
            options: {
                space: '  ',
                wrap: '"use strict";\n\n {%= __ngModule %}',
                name: 'config',
                dest: 'config.js'
        },
      // Environment targets
        development: {
            options: {
                dest: 'config/config.js'
        },
        constants: {
            ENV: {
                name: 'development',
                apiEndpoint: 'http://your-development.api.endpoint:3000',
                storeTenant: 'onlineshop'
            }
        }
      },
      production: {
        options: {
          dest: 'config/config.js'
        },
        constants: {
          ENV: {
            name: 'production',
            apiEndpoint: 'http://api.livesite.com',
            storeTenant: 'onlineshop_demo'
          }
        }
      }
    }

    });

    grunt.option('force', true);

    //grunt.registerTask('devServer', ['livereload:express', 'express-keepalive']);

    // Default task
    grunt.registerTask('default', [
        'jshint',
        'ngconstant:development',
        'concurrent:dev'
    ]);

    grunt.registerTask('testENV', [
        'ngconstant:development'
    ]);

    grunt.registerTask('production', [
        'jshint',
        'ngconstant:production',
        'concurrent:dev'
    ]);
    // Build task
    grunt.registerTask('build', [
        'clean:dist',
        'concurrent:dist',
        'ngconstant:production',
        'copy',
        'useminPrepare',
        'concat',
        'uglify',
        'rev',
        'usemin'
    ]);


};
