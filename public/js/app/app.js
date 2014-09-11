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
    'ds.account',
    'ds.auth',
    'ds.orders',
    'ds.queue',
    'config'
])
    .constant('_', window._)
    /*
    .factory('YaasRestangular', ['Restangular', function (Restangular) {
        return Restangular.withConfig(function(RestangularConfigurator) {

        });
    }])*/
      /** Defines the HTTP interceptors. */
    .factory('interceptor', ['$q', '$injector', 'settings','TokenSvc', 'httpQueue',
        function ($q, $injector, settings,  TokenSvc, httpQueue) {

            return {
                request: function (config) {
                    document.body.style.cursor = 'wait';
                    if(config.url.indexOf(settings.apis.account.baseUrl)< 0 && config.url.indexOf('html') < 0) {
                        // tweak headers if going against non-proxied services
                        if (config.url.indexOf('yaas') < 0) {
                            delete config.headers[settings.apis.headers.hybrisAuthorization];
                            if (config.url.indexOf('product') < 0 && config.url.indexOf('shipping-cost') < 0) {
                                config.headers[settings.apis.headers.hybrisApp] = settings.hybrisApp;
                            }
                        } else {

                            var token = TokenSvc.getToken().getAccessToken();
                            if(token) {
                                // retrieving AnonAuthSvc via injector to avoid circular dependency at config time
                                config.headers[settings.apis.headers.hybrisAuthorization] = 'Bearer ' + token;
                            } else {
                                // issue request to get token and "save" http request
                                $injector.get('AnonAuthSvc').getToken();
                                var deferred = $q.defer();
                                httpQueue.append(config, deferred);
                                return deferred.promise;
                            }
                        }
                    }
                    console.log('sending config');
                    console.log(config.url);
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

                    if (response.status === 401 && response.data && response.data.fault && response.data.fault.faultstring && response.data.fault.faultstring.indexOf('Invalid access token')>-1) {
                        TokenSvc.unsetToken();
                    }
                    return $q.reject(response);
                }
            };
        }])



    // Configure HTTP and Restangular Providers - default headers, CORS
    .config(['$httpProvider', 'RestangularProvider', 'settings', 'storeConfig', function ($httpProvider, RestangularProvider, settings, storeConfig) {
        $httpProvider.interceptors.push('interceptor');

        // enable CORS
        $httpProvider.defaults.useXDomain = true;
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

    .run(['$rootScope', 'storeConfig', 'ConfigSvc', 'AuthDialogManager', '$location', 'settings', 'TokenSvc', 'AuthSvc', 'GlobalData', '$state', 'httpQueue',
        function ($rootScope, storeConfig, ConfigSvc, AuthDialogManager, $location, settings, TokenSvc, AuthSvc, GlobalData, $state, httpQueue) {
            if(storeConfig.token) {
                TokenSvc.setAnonymousToken(storeConfig.token, storeConfig.expiresIn);
            }

            ConfigSvc.loadConfiguration(storeConfig.storeTenant);
            
            $rootScope.$on('$stateChangeStart', function () {
                // Make sure dialog is closed (if it was opened)
                AuthDialogManager.close();
            });

            $rootScope.$on('authtoken:obtained', function(event, token){
                httpQueue.retryAll(token);
            });

            $rootScope.$on('$locationChangeSuccess', function() {
                if ($location.search()[settings.forgotPassword.paramName]) {
                    AuthDialogManager.open({}, { forgotPassword: true });
                }
            });

            $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState){
                // handle attempt to access protected resource - show login dialog if user is not authenticated
                if ( toState.data && toState.data.auth && toState.data.auth === 'authenticated' && !AuthSvc.isAuthenticated() ) {
                    var callback = function (){
                        if(AuthSvc.isAuthenticated()){
                            $state.go(toState, toParams);
                        }
                    };
                    AuthDialogManager.open({}, {}).then(function(){
                           callback();
                        },
                        function() {
                            callback();
                        }
                    );
                    // block immediate state transition to protected resources - re-navigation will be handled by callback
                    if(!AuthSvc.isAuthenticated()){
                        event.preventDefault();
                        if(!fromState || fromState.name ==='') {
                           $state.go('base.product');
                        }

                    }
                }
            });

            $rootScope.$watch(function() { return AuthSvc.isAuthenticated(); }, function(isAuthenticated) {
                $rootScope.$broadcast(isAuthenticated ? 'user:signedin' : 'user:signedout');
                GlobalData.user.isAuthenticated = isAuthenticated;
                GlobalData.user.username = TokenSvc.getToken().getUsername();
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
                    }
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
                    abstract: true,
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
                        shippingCost: function (CheckoutSvc) {
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
                .state('base.account', {
                    url: '/account/',
                    views: {
                        'main@': {
                            templateUrl: 'js/app/account/templates/account.html',
                            controller: 'AccountCtrl'
                        }
                    },
                    resolve: {
                        account: function(AccountSvc) {
                            return AccountSvc.account();
                        },
                        addresses: function(AccountSvc) {
                            return AccountSvc.getAddresses();
                        },
                        orders: function(OrderListSvc) {
                            var parms = {
                                pageSize: 10
                            };
                            return OrderListSvc.query(parms);
                        }
                    },
                    data: {
                        auth: 'authenticated'
                    }
                });

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


