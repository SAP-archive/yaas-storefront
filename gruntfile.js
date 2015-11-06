'use strict';

var path = require('path');

module.exports = function (grunt) {

    var host = process.env.VCAP_APP_HOST || '0.0.0.0';
    var port = process.env.VCAP_APP_PORT || 9000;

    // Configuration Variables.
    var JS_DIR = 'public/js/app',
        LESS_DIR = 'public/less',

        //--Set Parameters for Server Configuration----------------------------------------------------
        // Read npm argument and set the dynamic server environment or use default configuration.
        // Syntax example for npm 2.0 parameters: $ npm run-script singleProd -- --pid=xxx --cid=123
        PROJECT_ID = grunt.option('pid') || 'argotest',
        CLIENT_ID = grunt.option('cid') || '0s94dhhcJYpy3hD80Kuyvj8MIW0Y0esY',
        REDIRECT_URI = 'http://example.com',

        PROJECT_ID_PATH = './public/js/app/shared/app-config.js',
        PROD_DOMAIN = 'api.yaas.io',
        STAGE_DOMAIN = 'api.stage.yaas.io',
        TEST_DOMAIN = 'api.yaas.ninja',
        API_DOMAIN_PATH = './public/js/app/shared/app-config.js',
        DOMAIN_MSG = 'Could not find environment domain in build parameter. Site is built with default API domain. Use grunt build:test [:stage or :prod] to specify.';

    require('load-grunt-tasks')(grunt);
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-angular-templates');  //combines templates into cache

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
            singleProdServer: {
                options: {
                    server: path.resolve('./server/singleProdServer.js'),
                    livereload: 35730, // use different port to avoid collision with client 'watch' operation
                    serverreload: true,  // this will keep the server running, but may restart at a different port!!!
                    bases: [path.resolve('./server/singleProdServer.js')]
                }
            },
            singleTenant: {
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
                    'public/css/app/style.css' : 'public/less/main.less'
                }
            },
            dist : {
                options : {
                    compress: true,
                    strictImports : false,
                    sourceMap: false
                },
                files : {
                    'public/css/app/style.css' : 'public/less/main.less'
                }
            }
        },

        concurrent: {
            singleProject: {
                tasks: ['express:singleTenant', 'watch'],  //server.js
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
            singleProdServer: {
                tasks: ['express:singleProdServer', 'watch'],
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
                    '../multi-tenant/**', '../server/**', '../server.js'],
                dest: 'dist/public/'
            }
        },

        rev: {
            files: {
                src: ['dist/public/**/*.{js,css}']
            }
        },

        karma: {
            unit: { configFile: 'config/karma.conf.js', keepalive: true }
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
            },
            clientId: {
                src: [ PROJECT_ID_PATH ],
                overwrite: true,
                replacements: [{
                    from: /StartClientId(.*)EndClientId/g,
                    to: 'StartClientId*/ \''+ CLIENT_ID +'\' /*EndClientId'
                }]
            },
            redirectURI: {
                src: [ PROJECT_ID_PATH ],
                overwrite: true,
                replacements: [{
                    from: /StartRedirectURI(.*)EndRedirectURI/g,
                    to: 'StartRedirectURI*/ \''+ REDIRECT_URI +'\' /*EndRedirectURI'
                }]
            }
        },

        ngtemplates:  {
            app: {  //compile html templates into angular min.js concatenation.
                cwd:'./public/',
                src: [
                    'js/app/home/templates/home.html',
                    'js/app/shared/templates/top-navigation.html',
                    'js/app/shared/templates/sidebar-navigation.html',
                    'js/app/cart/templates/cart.html',
                    'js/app/auth/templates/signup.html',
                    'js/app/auth/templates/signin.html'
                    //too many slows down time to render.
                    //'js/app/auth/templates/auth.html',
                    //'js/app/shared/templates/language-selector.html',
                    //'js/app/shared/templates/currency-selector.html',
                ],
                dest: '.tmp/concat/js/template.js', //temp concatenation location.
                htmlmin: {  // minify html configuration.
                    collapseBooleanAttributes:      true,
                    collapseWhitespace:             true,
                    removeAttributeQuotes:          true,
                    removeComments:                 true,
                    removeEmptyAttributes:          true,
                    removeRedundantAttributes:      true,
                    removeScriptTypeAttributes:     true,
                    removeStyleLinkTypeAttributes:  true
                },
                options: {
                    usemin: 'js/storefront.js', //concat temp with usemin output.
                    module: 'ds.app'  //module to append templateCache code.
                }
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

        grunt.task.run('replace:projectId');
        grunt.task.run('replace:clientId');
        grunt.task.run('replace:redirectURI');

        runDomainReplace(domainParam);

        grunt.task.run('jshint');
        grunt.task.run('less:dev');
        grunt.task.run('optimizeCode');
    });

    //--Tasks-With-Environment-Parameters----------------------------------------------
    // Wrap build task with parameters and dynamic domain warnings.
    grunt.registerTask('singleProject', 'Build parameters for singleProject build',
      function(domainParam){

        grunt.task.run('replace:projectId');
        grunt.task.run('replace:clientId');
        grunt.task.run('replace:redirectURI');

        runDomainReplace(domainParam);

        grunt.task.run('singleProjectTask');
    });

    // Wrap build task with parameters and dynamic domain warnings.
    grunt.registerTask('multiProject', 'Build parameters for multiProject build',
      function(domainParam){

        grunt.task.run('replace:projectId');
        grunt.task.run('replace:clientId');
        grunt.task.run('replace:redirectURI');

        runDomainReplace(domainParam);

        grunt.task.run('multiProjectTask');
    });

    // Wrap build task with parameters and dynamic domain warnings.
    grunt.registerTask('prepareBuild', 'Build parameters for optimized build',
      function(domainParam){

        grunt.task.run('replace:projectId');
        grunt.task.run('replace:clientId');
        grunt.task.run('replace:redirectURI');

        runDomainReplace(domainParam);

        grunt.task.run('optimizeCode');
    });

    // Wrap build task with parameters and dynamic domain warnings.
    grunt.registerTask('startServer', 'Start server within deploy environment',
      function(){
        if (grunt.option('single')){
            grunt.task.run('concurrent:singleProdServer');  // start a single server in deployed environment.

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
        'less:dev',        //generate style.css
        'copy',            //moves dev files to dist
        'useminPrepare',   //starts usemin process
        'ngtemplates',     //compile html templates into ng.
        'concat',
        'uglify',
        'cssmin',
        //'rev',             //cachebusts css and js.  //be careful was introducing first load latency.
        'usemin'           //completes usemin process.
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
