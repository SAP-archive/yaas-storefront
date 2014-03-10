'use strict';

window.app = angular.module('hybris.bs&d.newborn', [
        'ngCookies',
        'ngResource',
        'ui.router',
        'hybris.bs&d.newborn.i18n',
        'hybris.bs&d.newborn.products',
        'hybris.bs&d.newborn.utils',
        'hybris.bs&d.newborn.shared'
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
                            templateUrl: 'public/js/app/home/templates/body.html'
                        }
                    }
                })
                .state('base.products', {
                    url: '/products',
                    views: {
                        'body@': {
                            templateUrl: 'public/js/app/products/templates/products.html',
                            controller: 'ProductsCtrl'
                        }
                    }
                });

            $urlRouterProvider.otherwise('/');
            $locationProvider.hashPrefix('!');
        }
    ])
    
    .run(['CORSProvider',
        function (CORSProvider) {
            CORSProvider.enableCORS();
        }
    ]);