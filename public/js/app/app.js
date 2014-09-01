'use strict';

/**  Initializes and configures the application. */
window.app = angular.module('ds.router', [
    'restangular',
    'ui.router',
    'ds.shared',
    'ds.i18n',
    'ds.products',
    'ds.cart',
    'ds.checkout',
    'ds.confirmation',
    'ds.auth',
    'config'
])
    .constant('_', window._)

      /** Defines the HTTP interceptors. */
    .factory('interceptor', ['$q', 'settings',
        function ($q, settings) {

            return {
                request: function (config) {
                    document.body.style.cursor = 'wait';
                    // tweak headers if going against non-proxied services
                    if(config.url.indexOf('yaas') < 0){
                        delete config.headers[settings.apis.headers.hybrisAuthorization];
                        if(config.url.indexOf('product') < 0  && config.url.indexOf('shipping-cost') < 0 ) {
                            config.headers[settings.apis.headers.hybrisApp] = settings.hybrisApp;
                        }
                    }

                    //config.headers[settings.apis.headers.hybrisAuthentication] = 'Bearer ' + Storage.getToken().getAccessToken();
                    // TODO: use this once switched to proxies (passing accessToken)
                    // if (Storage.getToken().getAccessToken()) {
                    //     // config.headers[settings.apis.headers.hybrisAuthentication] = 'Bearer' + Storage.getToken().getAccessToken();
                    // }
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
                    return $q.reject(response);
                }
            };
        }])
    // Configure HTTP and Restangular Providers - default headers, CORS
    .config(['$httpProvider', 'RestangularProvider', 'settings', 'storeConfig', function ($httpProvider, RestangularProvider, settings, storeConfig) {
        $httpProvider.interceptors.push('interceptor');

        // enable CORS
        $httpProvider.defaults.useXDomain = true;


        var headers = {};
        headers[settings.apis.headers.hybrisAuthorization] = 'Bearer ' + storeConfig.token;

        RestangularProvider.setDefaultHeaders(headers);
        RestangularProvider.addFullRequestInterceptor( function(element, operation, route, url, headers, params, httpConfig) {

            var oldHeaders = {};
            if(url.indexOf('yaas')<0) {
                delete $httpProvider.defaults.headers.common[settings.apis.headers.hybrisAuthorization];
                //work around if not going through Apigee proxy for a particular URL, such as while testing new services
                oldHeaders [settings.apis.headers.hybrisTenant] = storeConfig.storeTenant;
                oldHeaders [settings.apis.headers.hybrisRoles] = settings.roleSeller;
                oldHeaders [settings.apis.headers.hybrisUser] = settings.hybrisUser;
            }
            return {
                element: element,
                params: params,
                headers: _.extend(headers, oldHeaders),
                httpConfig: httpConfig
            };
        });
    }])
    // Load the basic store configuration
    .run(['$rootScope', 'storeConfig', 'ConfigSvc', 'AuthDialogManager', '$location', 'settings',
        function ($rootScope, storeConfig, ConfigSvc, AuthDialogManager, $location, settings) {
            ConfigSvc.loadConfiguration(storeConfig.storeTenant);

            $rootScope.$on('$stateChangeStart', function () {
                // Make sure dialog is closed (if it was opened)
                AuthDialogManager.close();
            });
            $rootScope.$on('$locationChangeSuccess', function() {
                if ($location.search()[settings.forgotPassword.paramName]) {
                    AuthDialogManager.open({}, { forgotPassword: true });
                }
            });

            // setting root scope variables that drive class attributes in the BODY tag
            $rootScope.showCart =false;
            $rootScope.showMobileNav=false;
        }
    ])

    /** Sets up the routes for UI Router. */
    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', 'TranslationProvider', 'storeConfig',
        function($stateProvider, $urlRouterProvider, $locationProvider, TranslationProvider, storeConfig) {

            // Set default language
            TranslationProvider.setPreferredLanguage( storeConfig.defaultLanguage );

            // States definition
            $stateProvider
                .state('base', {
                    abstract: true,
                    views: {

                        'sidebarNavigation@': {
                            templateUrl: 'js/app/shared/templates/sidebar-navigation.html',
                            controller: 'SidebarNavigationCtrl'
                        },
                        'topNavigation@': {
                            templateUrl: 'js/app/shared/templates/top-navigation.html',
                            controller: 'TopNavigationCtrl'
                        },
                        'cart@': {
                            templateUrl: 'js/app/cart/templates/cart.html',
                            controller: 'CartCtrl'
                        }
                    },
                    resolve:  {
                        accessToken: function(AuthSvc) {
                            var accessToken = AuthSvc.getToken().getAccessToken();
                            if (!accessToken) {
                                accessToken = AuthSvc.signin();
                            }
                            return accessToken;
                        },
                        cart: function(CartSvc){
                            CartSvc.getCart();
                        }
                    },
                    onEnter: function($location, settings, AuthDialogManager){
                        if ($location.search()[settings.forgotPassword.paramName]) {
                            console.log('forgotPassword parameter found');
                            AuthDialogManager.open({
                                templateUrl: './js/app/auth/templates/password.html'
                            });
                        }
                    }
                })
                .state('base.product', {
                    url: '/products/',
                    views: {
                        'main@': {
                            templateUrl: 'js/app/products/templates/product-list.html',
                            controller: 'BrowseProductsCtrl'
                        }
                    },
                })
                .state('base.product.detail', {
                    url: ':productId/',
                    views: {
                        'main@': {
                            templateUrl: 'js/app/products/templates/product-detail.html',
                            controller: 'ProductDetailCtrl'
                        }
                    },
                    resolve: {
                        product: function( $stateParams, PriceProductREST) {
                            return PriceProductREST.ProductDetails.one('productdetails', $stateParams.productId).get()
                                .then(function(result){
                                    return result;
                                });
                        }
                    }
                })
                .state('base.checkout', {
                    views: {
                        'main@': {
                            templateUrl: 'js/app/checkout/templates/checkout-frame.html'
                        }
                    },
                    resolve: {
                        cart: function (CartSvc) {
                            return CartSvc.getCart();
                        },
                        order: function (CheckoutSvc) {
                            return CheckoutSvc.getDefaultOrder();
                        },
                        shippingCost: function(CheckoutSvc){
                            return CheckoutSvc.getShippingCost();
                        }
                    }
                })
                .state('base.checkout.details', {
                    url: '/checkout/',
                    views: {
                        'orderdetails': {
                            templateUrl: 'js/app/checkout/templates/order-details.html',
                            controller: 'OrderDetailCtrl'
                        },
                        'checkoutform': {
                            templateUrl: 'js/app/checkout/templates/checkout-form.html',
                            controller: 'CheckoutCtrl'
                        }
                    }
                })
                .state('base.confirmation', {
                    url: '/confirmation/:orderId/',
                    views: {
                        'main@': {
                            templateUrl: 'js/app/confirmation/templates/confirmation.html',
                            controller: 'ConfirmationCtrl'
                        }
                    }
                })
                .state('base.profile', {
                    url: '/profile/',
                    views: {
                        'main@': {
                            templateUrl: 'js/app/auth/templates/profile.html',
                            controller: 'CartCtrl'
                        }
                    }
                })
                .state('base.account', {
                    url: '/account/',
                    views: {
                        'main@': {
                            templateUrl: 'js/app/account/templates/customer-account.html',
                            //templateUrl: 'public/js/app/account/templates/order-detail.html',
                            controller: 'AccountCtrl'
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

