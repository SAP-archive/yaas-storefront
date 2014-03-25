'use strict';

module.exports = function(grunt) {

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
                '!public/js/vendor/{,**/}*.js'
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
                    port: 9000,
                    hostname: 'localhost',
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
        }

    });

    grunt.option('force', true);

    // Default task
    grunt.registerTask('default', [
        'jshint',
        'concurrent:dev',
        'compass'
    ]);

    // Build task
    grunt.registerTask('build', [
        'clean:dist',
        'concurrent:dist',
        'copy',
        'useminPrepare',
        'concat',
        'uglify',
        'rev',
        'usemin'
    ]);


};
