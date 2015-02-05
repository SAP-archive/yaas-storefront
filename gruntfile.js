'use strict';

var path = require('path');

module.exports = function (grunt) {

    var host = process.env.VCAP_APP_HOST || '0.0.0.0';
    var port = process.env.VCAP_APP_PORT || 9000;

    // Configuration Variables.
    var JS_DIR = 'public/js/app',
        LESS_DIR = 'public/less',
        PROJECT_ID = 'defaultproj',
        PROJECT_ID_PATH = './public/js/bootstrap.js',
        PROD_DOMAIN = 'api.yaas.io',
        STAGE_DOMAIN = 'api.stage.yaas.io',
        TEST_DOMAIN = 'yaas-test.apigee.net/test',
        API_DOMAIN_PATH = './public/js/app/shared/site-config.js',
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
            singleProject: {
                tasks: ['express:livereload', 'watch'],  //server.js
                options: {
                    logConcurrentOutput: true
                }
            },
            multiProject: {
                tasks: ['express:multiTenant', 'watch'], //multi-tenant-server.js
                options: {
                    logConcurrentOutput: true
                }
            },
            dist: []
        },

        clean: {
            dist: {
                files: [
                    {
                        dot: true,
                        src: ['.tmp','dist/*']
                    }
                ]
            }
        },

        copy: {
            main: {
                dot: true,
                expand: true,
                cwd: 'public/',
                src: [
                    '**', 'js/**', '!scss/**', '!css/app/**', '!less/**', '!stylesheets/**',
                    '../.buildpacks', '../.jshintrc', '../.bowerrc', '../bower.json',
                    '../gruntfile.js', '../License.md', '../package.json', '../products.json',
                    '../multi-tenant/**', '../server.js'],
                dest: 'dist/public/'
            }
        },

        rev: {
            files: {
                src: ['dist/**/*.{js,css}']
            }
        },

        karma: {
            unit: { configFile: 'config/karma.conf.js', keepalive: true }
            // TODO: get protractor working with grunt
            // e2e: { configFile: 'config/protractor-conf.js', keepalive: true },
            // watch: { configFile: 'test/config/unit.js', singleRun:false, autoWatch: true, keepalive: true }
        },

        useminPrepare: {
            html: './public/index.html',  //concat and minify all script tags in html build blocks.
            options: {                    //concats in .tmp
              dest: 'dist/public'         //minifies result at path in html block under this directory
            }
        },

        usemin: {
            html: ['dist/public/index.html']    //runs replacement tasks on index.
        },

        replace: {
            test: {
                src: [ API_DOMAIN_PATH ],
                overwrite: true,
                replacements: [{
                    from: /StartDynamicDomain(.*)EndDynamicDomain/g,
                    to: 'StartDynamicDomain*/ \''+ TEST_DOMAIN +'\' /*EndDynamicDomain'
                }]
            },
            stage: {
                src: [ API_DOMAIN_PATH ],
                overwrite: true,
                replacements: [{
                    from: /StartDynamicDomain(.*)EndDynamicDomain/g,
                    to: 'StartDynamicDomain*/ \''+ STAGE_DOMAIN +'\' /*EndDynamicDomain'
                }]
            },
            prod: {
                src: [ API_DOMAIN_PATH ],
                overwrite: true,
                replacements: [{
                    from: /StartDynamicDomain(.*)EndDynamicDomain/g,
                    to: 'StartDynamicDomain*/ \''+ PROD_DOMAIN +'\' /*EndDynamicDomain'
                }]
            },
            projectId: {
                src: [ PROJECT_ID_PATH ],
                overwrite: true,
                replacements: [{
                    from: /StartProjectId(.*)EndProjectId/g,
                    to: 'StartProjectId*/ \''+ PROJECT_ID +'\' /*EndProjectId'
                }]
            }
        }

    });

    grunt.option('force', true);

    //--Convenience-Tasks-----------------------------------------------
    // Wrap dev build task with parameters and dynamic domain warnings.
    grunt.registerTask('default', 'Build parameters for default',
      function(){
        grunt.task.run('build');
    });

    // Wrap build task with parameters and dynamic domain warnings.
    grunt.registerTask('build', 'Build parameters for build',
      function(domainParam){
        runDomainReplace(domainParam);
        grunt.task.run('replace:projectId');
        grunt.task.run('jshint');
        grunt.task.run('less:dev');
        grunt.task.run('optimizeCode');
    });

    //--Tasks-With-Environment-Parameters----------------------------------------------
    // Wrap build task with parameters and dynamic domain warnings.
    grunt.registerTask('singleProject', 'Build parameters for singleProject build',
      function(domainParam){
        runDomainReplace(domainParam);
        grunt.task.run('replace:projectId');
        grunt.task.run('singleProjectTask');
    });

    // Wrap build task with parameters and dynamic domain warnings.
    grunt.registerTask('multiProject', 'Build parameters for multiProject build',
      function(domainParam){
        runDomainReplace(domainParam);
        grunt.task.run('replace:projectId');
        grunt.task.run('multiProjectTask');
    });

    // Wrap build task with parameters and dynamic domain warnings.
    grunt.registerTask('prepareBuild', 'Build parameters for optimized build',
      function(domainParam){
        runDomainReplace(domainParam);
        grunt.task.run('replace:projectId');
        grunt.task.run('optimizeCode');
    });

    // Wrap build task with parameters and dynamic domain warnings.
    grunt.registerTask('startServer', 'Start server within deploy environment',
      function(){
        if (grunt.option('single')){
            grunt.task.run('concurrent:singleProject');  // start a single server in deployed environment.

        } else if (grunt.option('multiple')){
            grunt.task.run('concurrent:multiProject');   // start a multi-project server in deployed environment.

        } else {
            grunt.task.run('concurrent:multiProject');   // default server if none is specified.
        }
    });

    //---Specialized-Build-Behaviors--------------------------------------------------------
    grunt.registerTask('singleProjectTask', [
        'jshint',
        'less:dev',
        'concurrent:singleProject'   //server.js
    ]);

    grunt.registerTask('multiProjectTask', [
        'jshint',
        'less:dev',
        'concurrent:multiProject'  //multi-tenant-server.js
    ]);

    grunt.registerTask('optimizeCode', [
        'clean:dist',      //deletes contents in the dist folder and the .tmp folder
        // 'concurrent:dist',
        'copy',            //moves dev files to dist
        'useminPrepare',   //starts usemin process
        //'less:dist',
        //'rev',           //cachebusts css and js.
        'concat',
        'uglify',
        'cssmin',
        'usemin'           //completes usemin process
    ]);


    //--Dynamic-Replacement-Build-Behaviors----------------------------------------------------
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


};
