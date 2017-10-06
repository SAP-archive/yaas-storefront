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
        PROJECT_ID = grunt.option('pid'),
        CLIENT_ID = 'NmIaB67D5XXMv9YzPUXT32X4TKQwdCM2',
        REDIRECT_URI = grunt.option('ruri') || 'http://example.com',
        USE_HTTPS = grunt.option('https') || false,
        REGION_CODE = grunt.option('region') || '',

        SERVER_FILES = ['./server.js', './server/singleProdServer.js', './multi-tenant/multi-tenant-server.js'],

        PROJECT_ID_PATH = './public/js/app/shared/app-config.js',
        INDEX_PATH = './public/index.html',
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

    var getPiwikUrl = function (env, regionCode) {
        if (env === 'PROD') {
            return 'https://' + getProdBaseUrl(regionCode) + '/hybris/profile-edge/v1' + '/events';
        }
        else if (env === 'STAGE') {
            return 'https://' + STAGE_DOMAIN + '/hybris/profile-edge/v1' + '/events';
        }
    };

    var getCustomerConsentManagerUrl = function (regionCode) {
        if(regionCode.toUpperCase === 'EU'){
            return 'https://customer-manager.eu-central.stage.modules.yaas.io'
        }
        return 'https://customer-manager.us-east.modules.yaas.io'
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
            singleTenant: {
                options: {
                    server: path.resolve('./server.js'),
                    livereload: 35730, // use different port to avoid collision with client 'watch' operation
                    serverreload: true,  // this will keep the server running, but may restart at a different port!!!
                    bases: [path.resolve('./server.js')]
                }
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc',
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
            }
        },

        concurrent: {
            singleProject: {
                tasks: ['express:singleTenant', 'watch'],  //server.js
                options: {
                    logConcurrentOutput: true
                }
            }
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

        karma: {
            unit: {configFile: 'config/karma.conf.js', keepalive: true}
        },

        replace: {
            prod: {
                src: [API_DOMAIN_PATH, INDEX_PATH],
                overwrite: true,
                replacements: [{
                    from: /StartDynamicDomain(.*)EndDynamicDomain/g,
                    to: 'StartDynamicDomain*/ \'' + getProdBaseUrl(REGION_CODE) + '\' /*EndDynamicDomain'
                },
                    {
                        from: /StartBuilderUrl(.*)EndBuilderUrl/g,
                        to: 'StartBuilderUrl*/ \'' + 'https://' + PROD_DOMAIN.replace('api', 'builder').replace('{0}', '') + '/\' /*EndBuilderUrl'
                    },
                    {
                        from: /StartConsentManagerUrl(.*)EndConsentManagerUrl/g,
                        to: 'StartConsentManagerUrl*/ \'' +  getCustomerConsentManagerUrl(REGION_CODE) + '/\' /*EndConsentManagerUrl'
                    },
                    {
                        from: /StartPiwikUrl(.*)EndPiwikUrl/g,
                        to: 'StartPiwikUrl*/ \'' + getPiwikUrl('PROD', REGION_CODE) + '\' /*EndPiwikUrl'
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

        'json-minify': {
            translations: {
                files: TRANSLATE_FILES_PATH
            }
        }

    });

    grunt.option('force', true);


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

    //---Specialized-Build-Behaviors--------------------------------------------------------
    grunt.registerTask('singleProjectTask', [
        'compileTranslations',
        'less:dev',
        'concurrent:singleProject'   //server.js
    ]);

    grunt.registerTask('compileTranslations', [
        'copy:translations',        //copies translation files from dev folder to lang folder
        'json-minify:translations'  //minifies JSON translation files
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
