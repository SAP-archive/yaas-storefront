/**
 * [y] hybris Platform
 *
 * Copyright (c) 2000-2016 hybris AG
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of hybris
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with hybris.
 */

'use strict';

var path = require('path');

module.exports = function (grunt) {

    var host = process.env.VCAP_APP_HOST || process.env.HOST || '0.0.0.0';
    var port = process.env.VCAP_APP_PORT || process.env.PORT || 9000; //process.env.VCAP_APP_PORT is deprecated

    // Configuration Variables.
    var JS_DIR = 'public/js/app',
        LESS_DIR = 'public/less',
        TRANSLATIONS_DIR = 'public/js/app/shared/i18n/dev',

        ALLOWED_REGIONS = ['eu'],
        REGION_INVALID_MSG = 'Selected region is not valid, changing back to default region. Please provide one of valid regions: [' + ALLOWED_REGIONS.join(',') + ']',

        //--Set Parameters for Server Configuration----------------------------------------------------
        // Read npm argument and set the dynamic server environment or use default configuration.
        // Syntax example for npm 2.0 parameters: $ npm run-script singleProd -- --pid=xxx --cid=123 --ruri=http://example.com
        PROJECT_ID = grunt.option('pid') || 'saphybriscaas',
        CLIENT_ID = grunt.option('cid') || 'hkpWzlQnCIe4MSTi1Ud94Q7O36aRrRrO',
        REDIRECT_URI = grunt.option('ruri') || 'http://example.com',
        USE_HTTPS = grunt.option('https') || false,
        REGION_CODE = grunt.option('region') || '',

        SERVER_FILES = ['./server.js', './server/singleProdServer.js', './multi-tenant/multi-tenant-server.js'],

        PROJECT_ID_PATH = './public/js/app/shared/app-config.js',
        PROD_DOMAIN = 'api{0}.yaas.io',
        STAGE_DOMAIN = 'api.stage.yaas.io',
        API_DOMAIN_PATH = './public/js/app/shared/app-config.js',
        TRANSLATE_FILES_PATH = './public/js/app/shared/i18n/lang/lang_*.json',
        DOMAIN_MSG = 'Could not find environment domain in build parameter. Site is built with default API domain. Use grunt build:prod [:stage] to specify.';

    var getProdBaseUrl = function getProdBaseUrl(regionCode) {
        if (!!regionCode && ALLOWED_REGIONS.indexOf(regionCode) < 0) {
            grunt.option('force', true);
            grunt.warn(REGION_INVALID_MSG);
            regionCode = '';
        }

        if (!!regionCode) {
            return PROD_DOMAIN.replace('{0}', '.' + regionCode);
        }
        else {
            return PROD_DOMAIN.replace('{0}', '');
        }
    };

    require('load-grunt-tasks')(grunt);
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-angular-templates');  //combines templates into cache

    // Project Configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        watch: {
            translations: {
                files: [TRANSLATIONS_DIR + '/**'],
                tasks: ['compileTranslations']
            },
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
            dev: {
                options: {
                    strictImports: true,
                    sourceMap: false,
                    sourceMapFilename: 'public/css/app/style.css.map',
                    sourceMapURL: 'http://localhost/css/style.css.map'
                },
                files: {
                    'public/css/app/style.css': 'public/less/main.less'
                }
            },
            dist: {
                options: {
                    compress: true,
                    strictImports: false,
                    sourceMap: false
                },
                files: {
                    'public/css/app/style.css': 'public/less/main.less'
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
                        src: ['.tmp', 'dist/*']
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
            },
            translations: {
                files: [
                    {
                        expand: true,
                        cwd: 'public/js/app/shared/i18n/dev/',
                        src: ['*.json'],
                        dest: 'public/js/app/shared/i18n/lang/',
                        rename: function (dest, src) {
                            return dest + src.replace(/^dev_/, 'lang_');
                        }
                    }
                ]
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
            stage: {
                src: [API_DOMAIN_PATH],
                overwrite: true,
                replacements: [{
                    from: /StartDynamicDomain(.*)EndDynamicDomain/g,
                    to: 'StartDynamicDomain*/ \'' + STAGE_DOMAIN + '\' /*EndDynamicDomain'
                }]
            },
            prod: {
                src: [API_DOMAIN_PATH],
                overwrite: true,
                replacements: [{
                    from: /StartDynamicDomain(.*)EndDynamicDomain/g,
                    to: 'StartDynamicDomain*/ \'' + getProdBaseUrl(REGION_CODE) + '\' /*EndDynamicDomain'
                }]
            },
            projectId: {
                src: [PROJECT_ID_PATH],
                overwrite: true,
                replacements: [{
                    from: /StartProjectId(.*)EndProjectId/g,
                    to: 'StartProjectId*/ \'' + PROJECT_ID + '\' /*EndProjectId'
                }]
            },
            clientId: {
                src: [PROJECT_ID_PATH],
                overwrite: true,
                replacements: [{
                    from: /StartClientId(.*)EndClientId/g,
                    to: 'StartClientId*/ \'' + CLIENT_ID + '\' /*EndClientId'
                }]
            },
            redirectURI: {
                src: [PROJECT_ID_PATH],
                overwrite: true,
                replacements: [{
                    from: /StartRedirectURI(.*)EndRedirectURI/g,
                    to: 'StartRedirectURI*/ \'' + REDIRECT_URI + '\' /*EndRedirectURI'
                }]
            },
            useHttps: {
                src: SERVER_FILES,
                overwrite: true,
                replacements: [{
                    from: /StartUseHTTPS(.*)EndUseHTTPS/g,
                    to: 'StartUseHTTPS*/ ' + !!USE_HTTPS + ' /*EndUseHTTPS'
                }]
            }
        },

        ngtemplates: {
            app: {  //compile html templates into angular min.js concatenation.
                cwd: './public/',
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
                    collapseBooleanAttributes: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: true,
                    removeComments: true,
                    removeEmptyAttributes: true,
                    removeRedundantAttributes: true,
                    removeScriptTypeAttributes: true,
                    removeStyleLinkTypeAttributes: true
                },
                options: {
                    usemin: 'js/storefront.js', //concat temp with usemin output.
                    module: 'ds.app'  //module to append templateCache code.
                }
            }
        },

        'json-minify': {
            translations: {
                files: TRANSLATE_FILES_PATH
            }
        }

    });

    grunt.option('force', true);

    //--Convenience-Tasks-----------------------------------------------
    // Wrap dev build task with parameters and dynamic domain warnings.
    grunt.registerTask('default', 'Build parameters for default',
        function () {
            grunt.task.run('build');
        });

    // Wrap build task with parameters and dynamic domain warnings.
    grunt.registerTask('build', 'Build parameters for build',
        function (domainParam) {

            grunt.task.run('replace:projectId');
            grunt.task.run('replace:clientId');
            grunt.task.run('replace:redirectURI');
            grunt.task.run('replace:useHttps');

            runDomainReplace(domainParam);

            grunt.task.run('jshint');
            grunt.task.run('less:dev');
            grunt.task.run('optimizeCode');
        });

    //--Tasks-With-Environment-Parameters----------------------------------------------
    // Wrap build task with parameters and dynamic domain warnings.
    grunt.registerTask('singleProject', 'Build parameters for singleProject build',
        function (domainParam) {

            grunt.task.run('replace:projectId');
            grunt.task.run('replace:clientId');
            grunt.task.run('replace:redirectURI');
            grunt.task.run('replace:useHttps');

            runDomainReplace(domainParam);

            grunt.task.run('singleProjectTask');
        });

    // Wrap build task with parameters and dynamic domain warnings.
    grunt.registerTask('multiProject', 'Build parameters for multiProject build',
        function (domainParam) {

            grunt.task.run('replace:projectId');
            grunt.task.run('replace:clientId');
            grunt.task.run('replace:redirectURI');
            grunt.task.run('replace:useHttps');

            runDomainReplace(domainParam);

            grunt.task.run('multiProjectTask');
        });

    // Wrap build task with parameters and dynamic domain warnings.
    grunt.registerTask('prepareBuild', 'Build parameters for optimized build',
        function (domainParam) {

            grunt.task.run('replace:projectId');
            grunt.task.run('replace:clientId');
            grunt.task.run('replace:redirectURI');
            grunt.task.run('replace:useHttps');

            runDomainReplace(domainParam);

            grunt.task.run('optimizeCode');
        });

    // Wrap build task with parameters and dynamic domain warnings.
    grunt.registerTask('startServer', 'Start server within deploy environment',
        function () {
            if (grunt.option('single')) {
                grunt.task.run('concurrent:singleProdServer');  // start a single server in deployed environment.

            } else if (grunt.option('multiple')) {
                grunt.task.run('concurrent:multiProject');   // start a multi-project server in deployed environment.

            } else {
                grunt.task.run('concurrent:multiProject');   // default server if none is specified.
            }
        });

    //---Specialized-Build-Behaviors--------------------------------------------------------
    grunt.registerTask('singleProjectTask', [
        'jshint',
        'compileTranslations',
        'less:dev',
        'concurrent:singleProject'   //server.js
    ]);

    grunt.registerTask('multiProjectTask', [
        'jshint',
        'compileTranslations',
        'less:dev',
        'concurrent:multiProject'  //multi-tenant-server.js
    ]);

    grunt.registerTask('compileTranslations', [
        'copy:translations',        //copies translation files from dev folder to lang folder
        'json-minify:translations'  //minifies JSON translation files
    ]);

    grunt.registerTask('optimizeCode', [
        'clean:dist',           //deletes contents in the dist folder and the .tmp folder
        'compileTranslations',  //removes comments from dev-*.json translation files and minifies them
        'less:dev',             //generate style.css
        'copy',                 //moves dev files to dist
        'useminPrepare',        //starts usemin process
        'ngtemplates',          //compile html templates into ng.
        'concat',
        'uglify',
        'cssmin',
        //'rev',                //cachebusts css and js.  //be careful was introducing first load latency.
        'usemin'                //completes usemin process.
    ]);

    //--Dynamic-Replacement-Build-Behaviors----------------------------------------------------
    // Read build parameter and set the dynamic domain for environment or give warning message.

    function runDomainReplace(domainParam) {
        switch ((domainParam !== undefined) ? domainParam.toLowerCase() : domainParam) {
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
