'use strict';

// ROUTER SHOULD ONLY LOAD MODULES DIRECTLY REQUIRED BY ROUTER
window.app = angular.module('ds.router', [
    'restangular',
    'ui.router',
    'ds.shared',
    'ds.utils',
    'ds.i18n',
    'ds.products',
    'ds.cart',
    'ds.checkout',
    'ds.confirmation',
    'wu.masonry'
])
    .constant('_', window._)

    .factory('interceptor', ['$q', 'settings', 'STORE_CONFIG',
        function ($q, settings, STORE_CONFIG) {
            var storeTenant = STORE_CONFIG.storeTenant;

            return {
                request: function (config) {
                    document.body.style.cursor = 'wait';
                    config.headers[settings.apis.headers.hybrisTenant] = storeTenant;
                    config.headers[settings.apis.headers.hybrisRoles] = settings.roleSeller;
                    config.headers[settings.apis.headers.hybrisUser] = settings.hybrisUser;

                    if(config.url.indexOf('product') < 0 && config.url.indexOf('orders') < 0 ) {
                        config.headers[settings.apis.headers.hybrisApp] = settings.hybrisApp;
                    }

                    return config || $q.when(config);
                },
                requestError: function(request){
                    document.body.style.cursor = 'auto';
                    return $q.reject(request);
                },
                response: function (response) {
                    document.body.style.cursor = 'auto';
                    return response || $q.when(response);
                },
                responseError: function (response) {
                    document.body.style.cursor = 'auto';
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


    .run(['CORSProvider', '$rootScope', 'STORE_CONFIG', 'ConfigSvc', 'Restangular', 'settings',
        function (CORSProvider, $rootScope, STORE_CONFIG, ConfigSvc, Restangular, settings) {
            /* enabling CORS to allow testing from localhost */
            CORSProvider.enableCORS();
            // provide tenant id for media lookup
            $rootScope.tenant = STORE_CONFIG.storeTenant;
            ConfigSvc.loadConfiguration(STORE_CONFIG.storeTenant);

            var headers = {};
            headers[settings.apis.headers.hybrisTenant] = STORE_CONFIG.storeTenant;
            headers[settings.apis.headers.hybrisRoles] = settings.roleSeller;
            headers[settings.apis.headers.hybrisUser] = settings.hybrisUser;
            Restangular.setDefaultHeaders(headers);
        }
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
                        'cart@': {
                            templateUrl: 'public/js/app/cart/templates/cart.html',
                            controller: 'CartCtrl'
                        }
                    },
                    resolve:  {
                        cart: function(CartSvc){
                            CartSvc.getCart();
                        }
                    }

                })
                .state('base.product', {
                    url: '/products/',
                    views: {
                        'body@': {
                            templateUrl: 'public/js/app/products/templates/product-list.html',
                            controller: 'BrowseProductsCtrl'
                        }
                    }
                })
                .state('base.product.detail', {
                    url: ':productId/',
                    views: {
                        'body@': {
                            templateUrl: 'public/js/app/products/templates/product-detail.html',
                            controller: 'ProductDetailCtrl'
                        }
                    },
                    resolve: {
                        product: function( $stateParams, ProductDetailsRest) {
                            return ProductDetailsRest.one('productdetails', $stateParams.productId).get()
                                .then(function(result){
                                    window.scrollTo(0, 0);
                                    return result;
                                });
                        }
                    }
                })
                .state('base.checkout', {
                    views: {
                        'body@': {
                            templateUrl: 'public/js/app/checkout/templates/checkout-frame.html'
                        }
                    },
                    resolve: {
                        cart: function (CartSvc) {
                            return CartSvc.getCart();
                        },
                        order: function (CheckoutSvc) {
                            return CheckoutSvc.getDefaultOrder();
                        }
                    }
                })
                .state('base.checkout.details', {
                    url: '/checkout/',
                    views: {
                        'orderdetails': {
                            templateUrl: 'public/js/app/checkout/templates/order-details.html',
                            controller: 'OrderDetailCtrl'


                        },
                        'checkoutform': {
                            templateUrl: 'public/js/app/checkout/templates/checkout-form.html',
                            controller: 'CheckoutCtrl'
                        }

                    }
                })


                .state('base.cart', {
                    url: '/cart/',
                    views: {
                        'body@': {
                            templateUrl: 'public/js/app/cart/templates/cart',
                            controller: 'CartCtrl'
                        }
                    }
                })

                .state('base.confirmation', {
                    url: '/confirmation/:orderId/',
                    views: {
                        'body@': {
                            templateUrl: 'public/js/app/confirmation/templates/confirmation.html',
                            controller: 'ConfirmationCtrl'
                        },
                        'navigation@': {
                            templateUrl: 'public/js/app/shared/templates/navigation-no-cart.html',
                            controller: 'NavigationCtrl'
                        }
                    }
                })



            ;

            $urlRouterProvider.otherwise('/products/');

            /* Code from angular ui-router to make trailing slash conditional */
            $urlRouterProvider.rule(function($injector, $location) {
                var path = $location.path()
                // Note: misnomer. This returns a query object, not a search string
                    , search = $location.search()
                    , params
                    ;

                // check to see if the path already ends in '/'
                if (path[path.length - 1] === '/') {
                    return;
                }

                // If there was no search string / query params, return with a `/`
                if (Object.keys(search).length === 0) {
                    return path + '/';
                }

                // Otherwise build the search string and return a `/?` prefix
                params = [];
                angular.forEach(search, function(v, k){
                    params.push(k + '=' + v);
                });
                return path + '/?' + params.join('&');
            });
            $locationProvider.hashPrefix('!');
        }
    ]);

