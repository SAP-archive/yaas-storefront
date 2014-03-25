'use strict';

// ROUTER SHOULD ONLY LOAD MODULES DIRECTLY REQUIRED BY ROUTER
window.app = angular.module('rice.router', [
        'ui.router',
        'rice.utils',
        'rice.constants'
    ])

    //Setting up routes
    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
        function($stateProvider, $urlRouterProvider, $locationProvider) {

            // States definition
            $stateProvider
                .state('base', {
                    abstract: true,
                    views: {
                        'navigation@': { templateUrl: 'public/js/app/shared/templates/navigation.html' },
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