'use strict';

module.exports = function(grunt) {

    var host = process.env.VCAP_APP_HOST || '0.0.0.0';
    var port = process.env.VCAP_APP_PORT || 9000;
    var CSS_DIR = 'public/css',
        SCSS_DIR = 'public/scss',
        IMG_DIR = 'public/img',
        JS_DIR = 'public/js';

    require('load-grunt-tasks')(grunt);

    grunt.loadNpmTasks('grunt-mustache-render');

    // Project Configuration
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        watch: {
            js: {
                files: [JS_DIR + '/**'],
                tasks: ['jshint:all'],
                options: {
                    livereload: true
                }
            },
            html: {
                files: ['public/views/**'],
                options: {
                    livereload: true
                }
            },
            css: {
                files: [CSS_DIR + '/**'],
                options: {
                    livereload: true
                }
            },
            compass: {
                files: [SCSS_DIR + '/**'],
                tasks: ['compass:dev']
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
                tasks: ['connect', 'watch'],
                options: {
                    logConcurrentOutput: true
                }
            },
            dist: [
                'compass:dist'
            ]
        },

        compass: {
            dist: {
                options: {
                    sassDir: SCSS_DIR,
                    cssDir: CSS_DIR,
                    imagesDir: IMG_DIR,
                    environment: 'production',
                    noLineComments: true
                }
            },
            dev: {
                options: {
                    sassDir: SCSS_DIR,
                    cssDir: CSS_DIR,
                    imagesDir: IMG_DIR
                }
            }
        },

        connect: {
            all: {
                options:{
                    port: port,
                    hostname: host,
                    keepalive: true
                }
            }
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
    },

    });

    grunt.option('force', true);

    // Default task
    grunt.registerTask('default', [
        'jshint',
        'ngconstant:development',
        'concurrent:dev',
        'compass'
    ]);

    grunt.registerTask('production', [
        'jshint',
        'ngconstant:production',
        'concurrent:dev',
        'compass'
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
