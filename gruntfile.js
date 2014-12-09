'use strict';

var path = require('path');

module.exports = function (grunt) {

    var host = process.env.VCAP_APP_HOST || '0.0.0.0';
    var port = process.env.VCAP_APP_PORT || 9000;
    var JS_DIR = 'public/js/app';
    var LESS_DIR = 'public/less';

    // Dynamic domain replacement
    var PROD_DOMAIN = 'api.yaas.io',
        TEST_DOMAIN = 'yaas-test.apigee.net/test',
        STAGE_DOMAIN = 'api.stage.yaas.io',
        REPLACEMENT_PATH = './public/js/app/shared/site-config.js',
        DOMAIN_MSG = 'Could not find environment domain in build parameter. Site is built with default API domain. Use grunt build:test [:stage or :prod] to specify.';

    require('load-grunt-tasks')(grunt);
    grunt.loadNpmTasks('grunt-text-replace');

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
            multiTenant: {  // with livereload
                options: {
                    server: path.resolve('./multi-tenant/multi-tenant-server.js'),
                    livereload: 35730, // use different port to avoid collision with client 'watch' operation
                    serverreload: true,  // this will keep the server running, but may restart at a different port!!!
                    bases: [path.resolve('./multi-tenant/multi-tenant-server.js')]
                }
            },
            production: {
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
                    sourceMap: false,
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
            multiTenant: {
                tasks: ['express:multiTenant', 'watch'],
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
        },

        replace: {
            test: {
                src: [ REPLACEMENT_PATH ],
                overwrite: true,
                replacements: [{
                    from: /StartDynamicDomain(.*)EndDynamicDomain/g,
                    to: 'StartDynamicDomain*/ \''+ TEST_DOMAIN +'\' /*EndDynamicDomain'
                }]
            },
            stage: {
                src: [ REPLACEMENT_PATH ],
                overwrite: true,
                replacements: [{
                    from: /StartDynamicDomain(.*)EndDynamicDomain/g,
                    to: 'StartDynamicDomain*/ \''+ STAGE_DOMAIN +'\' /*EndDynamicDomain'
                }]
            },
            prod: {
                src: [ REPLACEMENT_PATH ],
                overwrite: true,
                replacements: [{
                    from: /StartDynamicDomain(.*)EndDynamicDomain/g,
                    to: 'StartDynamicDomain*/ \''+ PROD_DOMAIN +'\' /*EndDynamicDomain'
                }]
            }
        }

    });

    grunt.option('force', true);

    // Read build parameter and set the dynamic domain for environment or give warning message.
    function runDomainReplace(domainParam){
        switch ((domainParam !== undefined) ? domainParam.toLowerCase() : domainParam ) {
            case 'test':
                grunt.task.run('replace:test');
                break;
            case 'stage':
                grunt.task.run('replace:stage');
                break;
            case 'prod':
                grunt.task.run('replace:prod');
                break;
            default:
                grunt.warn(DOMAIN_MSG);
                // Default build domain if none is specified.
                grunt.task.run('replace:prod');
        }
    }

    // Wrap default build task to add parameters and warnings.
    grunt.registerTask('default', 'Warning for default', function(domainParam){
        runDomainReplace(domainParam);
        grunt.task.run('defaultTask');
    });

    // Wrap build task to add parameters and warnings.
    grunt.registerTask('build', 'Parameters for build', function(domainParam){
        runDomainReplace(domainParam);
        grunt.task.run('buildTask');
    });

    // Wrap build task to add parameters and warnings.
    grunt.registerTask('multiTenant', 'Parameters for multiTenant build', function(domainParam){
        runDomainReplace(domainParam);
        grunt.task.run('multiTenantTask');
    });

    grunt.registerTask('expressKeepAlive', ['production:express', 'express-keepalive']);


    // Default task
    grunt.registerTask('defaultTask', [
        'jshint',
        'less:dev',
        'concurrent:dev'
    ]);

    // Default task
    grunt.registerTask('multiTenantTask', [
        'jshint',
        'less:dev',
        'concurrent:multiTenant'
    ]);

    grunt.registerTask('production', [
        'expressKeepAlive'
    ]);

    // Build task
    grunt.registerTask('buildTask', [
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
