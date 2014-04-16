'use strict';

// ROUTER SHOULD ONLY LOAD MODULES DIRECTLY REQUIRED BY ROUTER
window.app = angular.module('ds.router', [
        'ui.router',
        'ds.shared',
        'ds.utils',
        'ds.i18n',
        'ds.products',
        'ds.cart',
        'yng.core'
    ])
    .constant('_', window._)

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
                        'footer@': { templateUrl: 'public/js/app/shared/templates/footer.html' },
                        'cart@': {
                            templateUrl: 'public/js/app/cart/templates/cart.html',
                            controller: 'CartCtrl'
                        }
                    }
                })

                .state('base.product', {
                    url: '/products',
                    views: {
                        'body@': {
                            templateUrl: 'public/js/app/products/templates/product-list.html',
                            controller: 'BrowseProductsCtrl'
                        }
                    }
                })
                .state('base.product.detail', {
                    url: '/:productSku',
                    views: {
                        'body@': {
                            templateUrl: 'public/js/app/products/templates/product-detail.html',
                            controller: 'ProductDetailCtrl'
                        }
                    },
                    resolve: {
                        product: function( $stateParams, caas) {

                            return caas.products.API.get({productSku: $stateParams.productSku }).$promise
                                .then(function(result){
                                    window.scrollTo(0, 0);
                                    return result;
                                });
                            }
                    }
                })

                .state('base.cart', {
                    url: '/cart',
                    views: {
                        'body@': {
                            templateUrl: 'public/js/app/cart/templates/cart-template-to-be-replaced.html',
                            controller: 'CartCtrl'
                        }
                    }
                })
                ;

            $urlRouterProvider.otherwise('/products');
            $locationProvider.hashPrefix('!');
        }
    ])

    // Configure the API Provider - specify the base route and configure the end point with route and name
    .config(function(caasProvider, settings) {
        caasProvider.setBaseRoute(settings.apis.products.baseUrl);

        // create a specific endpoint name and configure the route
        caasProvider.endpoint('products', { productSku: '@productSku' }).
            route(settings.apis.products.route);
        // in addition, custom headers and interceptors can be added to this endpoint
    })

    .factory('interceptor', ['$q', 'settings',
        function ($q, settings) {
            return {
                request: function (config) {

                    config.headers[settings.apis.headers.tenant] = settings.tenantId;
                    config.headers[settings.apis.headers.authorization] = settings.authorizationId;

                    return config || $q.when(config);
                },
                requestError: function(request){
                    return $q.reject(request);
                },
                response: function (response) {
                    return response || $q.when(response);
                },
                responseError: function (response) {
                    if (response) {
                        switch(response.status) {
                            /* TBD
                             case 401:
                             $rootScope.$broadcast('auth:loginRequired');
                             break;
                             */
                        }
                    }
                    return $q.reject(response);
                }
            };
        }])
    .config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('interceptor');
    }])

    .run(['CORSProvider',
        function (CORSProvider) {
            /* enabling CORS to allow testing from localhost */
            CORSProvider.enableCORS();

        }
    ])

    ;

