'use strict';

// ROUTER SHOULD ONLY LOAD MODULES DIRECTLY REQUIRED BY ROUTER
window.app = angular.module('ds.router', [
        'ui.router',
        'ds.shared',
        'ds.utils',
        'ds.i18n'
    ])

    //Setting up routes
    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', 'TranslationProvider', 'settings',
        function($stateProvider, $urlRouterProvider, $locationProvider, TranslationProvider, settings) {

            // Set default language
            TranslationProvider.setPreferredLanguage( settings.languageCode );

            // States definition
            $stateProvider
                .state('base', {
                    abstract: true,
                    views: {
                        'navigation@': {
                            templateUrl: 'public/js/app/shared/templates/navigation.html',
                            controller: 'NavigationCtrl'
                        },
                        'header@': { templateUrl: 'public/js/app/shared/templates/header.html' },
                        'footer@': { templateUrl: 'public/js/app/shared/templates/footer.html' }
                    }
                })
                .state('base.home', {
                    url: '/',
                    views: {
                        'body@': {
                            templateUrl: 'public/js/app/home/templates/home.html'
                        }
                    }
                }) ;

            $urlRouterProvider.otherwise('/');
            $locationProvider.hashPrefix('!');
        }
    ])


    .run(['CORSProvider', '$rootScope', 'Constants',
        function (CORSProvider, $rootScope, Constants) {
            /* enabling CORS to allow testing from localhost */
            CORSProvider.enableCORS();
            $rootScope.CONTEXT_ROOT = Constants.baseUrl;
        }
    ])

    ;

