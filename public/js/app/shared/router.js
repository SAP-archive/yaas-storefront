/**
 * [y] hybris Platform
 *
 * Copyright (c) 2000-2015 hybris AG
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of hybris
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with hybris.
 */

'use strict';

angular.module('ds.router', [])

   /** Sets up the routes for UI Router. */
    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
        function($stateProvider, $urlRouterProvider, $locationProvider) {


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
                        },
                        'footer@':{
                            templateUrl: 'js/app/shared/templates/footer.html'
                        }
                    },
                    resolve:{
                        // this will block controller loading until the application has been initialized with
                        //  all required configuration (language, currency)
                        /* jshint ignore:start */
                        initialized: ['ConfigSvc',function(ConfigSvc) {
                            return ConfigSvc.initializeApp();
                        }]
                        /* jshint ignore:end */

                    }
                })
                .state('base.home', {
                    url: '/home',
                    views: {
                        'main@':{
                            templateUrl: 'js/app/home/templates/home.html',
                            controller: 'HomeCtrl'
                        }
                    },
                    resolve:{
                        // this will block controller loading until the application has been initialized with
                        //  all required configuration (language, currency)
                        dummy: ['initialized', function(initialized){// force initialization delay
                            if(initialized) {
                                return {};
                            }
                        }]
                    }
                })
                .state('base.search', {
                    url: '/search/:searchString',
                    views: {
                        'main@': {
                            templateUrl: 'js/app/search/templates/search-list.html',
                            controller: 'SearchListCtrl'
                        },
                        'footer@': {
                            template: ''
                        }
                    },
                    resolve:{
                        searchString: ['$sanitize', '$stateParams', function ($sanitize, $stateParams) {
                            $stateParams.searchString = $sanitize($stateParams.searchString);
                            return $stateParams.searchString;
                        }]
                    }

                })
                .state('base.product', {
                    url: '/products/',
                    abstract: true
                })
                .state('base.category', {
                    url: '/ct/:catName',
                    views: {
                        'main@': {
                            templateUrl: 'js/app/products/templates/product-list.html',
                            controller: 'BrowseProductsCtrl'
                        },
                        'footer@': {
                            template:''
                        }
                    },
                    resolve: {

                        category: ['$stateParams', 'CategorySvc', 'initialized', function ($stateParams, CategorySvc, initialized) {
                            if(initialized){
                                return CategorySvc.getCategoryWithProducts($stateParams.catName);
                            }

                        }]
                    }
                })
                .state('base.product.detail', {
                    url: ':productId',
                    params: {
                        lastCatId: 'lastCatId',
						variantId: null
                    },
                    views: {
                        'main@': {
                            templateUrl: 'js/app/products/templates/product-detail.html',
                            controller: 'ProductDetailCtrl'
                        }
                    },
                    resolve: {
                        product: ['$stateParams', 'PriceProductREST', 'CategorySvc', 'initialized', function ($stateParams, PriceProductREST, CategorySvc, initialized) {
                            if(initialized){
                                return PriceProductREST.ProductDetails.one('productdetails', $stateParams.productId).customGET('', {expand: 'media'})
                                    .then(function (prod) {
                                        if(prod.categories && prod.categories.length){
                                            return CategorySvc.getCategoryById(prod.categories[0].id).then(function(category){
                                                prod.richCategory = category;
                                                return prod;
                                            });

                                        } else {
                                            return prod;
                                        }
                                    });
                            }

                        }],
                        
                        variants: ['$stateParams', 'initialized', '$http', 'SiteConfigSvc',
                            function ($stateParams, initialized, $http, SiteConfigSvc) {
                                if (initialized) {
                                    // $http used since 'option' property in response body is not handled correctly by Restangular
                                    return $http.get(SiteConfigSvc.apis.products.baseUrl + '/products/' + $stateParams.productId + '/variants', {
                                        params: {
                                            pageNumber: 1, pageSize: 9999
                                        }
                                    }).then(function (response) {
                                        return response.data;
                                    });
                                }
                            }],

                        variantPrices: ['$stateParams', 'initialized', '$http', 'SiteConfigSvc', 'GlobalData',
                            function ($stateParams, initialized, $http, SiteConfigSvc, GlobalData) {
                                if (initialized) {
                                    return $http.get(SiteConfigSvc.apis.prices.baseUrl + '/prices', {
                                        params: {
                                            group: $stateParams.productId,
                                            currency: GlobalData.getCurrencyId()
                                        }
                                    }).then(function (response) {
                                        return response.data;
                                    });
                                }
                            }],

						variantId: ['$stateParams',
							function ($stateParams) {
								return $stateParams.variantId;
							}],

                        lastCatId: function ($stateParams) {
                            if($stateParams.lastCatId !== 'lastCatId') {
                                return $stateParams.lastCatId;
                            }
                            else{
                                return null;
                            }
                        },

                        shippingZones: ['ShippingSvc', 'initialized', function (ShippingSvc, initialized) {
                            if(initialized){
                                return ShippingSvc.getSiteShippingZones();
                            }
                        }]

                    }
                })
                .state('base.checkout', {
                    abstract: true,
                    views: {
                        'main@': {
                            templateUrl: 'js/app/checkout/templates/checkout-frame.html',
                            controller: 'CheckoutBaseCtrl'
                        }
                    },
                    resolve: {
                        cart: ['CartSvc', function (CartSvc) {
                            return CartSvc.getLocalCart();
                        }],
                        order: ['CheckoutSvc', function (CheckoutSvc) {
                            return CheckoutSvc.getDefaultOrder();
                        }],
                        shippingZones: ['ShippingSvc', 'initialized', function (ShippingSvc, initialized) {
                            if (initialized) {
                                return ShippingSvc.getSiteShippingZones();
                            }
                        }]
                    }
                })

                .state('base.checkout.details', {
                    url: '/checkout/',
                    views: {
                        'checkoutcart@base.checkout.details': {
                            templateUrl: 'js/app/checkout/templates/checkout-cart.html',
                            controller: 'CheckoutCartCtrl'
                        },
                        'checkoutcartmobile@base.checkout.details':{
                            templateUrl: 'js/app/checkout/templates/checkout-cart.html',
                            controller: 'CheckoutCartCtrl'
                        },
                        'checkoutform': {
                            templateUrl: 'js/app/checkout/templates/checkout-form.html',
                            controller: 'CheckoutCtrl'
                        },
                        'checkoutcartedit': {
                            templateUrl: 'js/app/checkout/templates/checkout-edit-cart.html',
                            controller: 'CheckoutEditCartCtrl'
                        }
                    }
                })
                .state('base.confirmation', {
                    url: '/confirmation/:entity/:id/',
                    views: {
                        'main@': {
                            templateUrl: 'js/app/confirmation/templates/confirmation.html',
                            controller: 'ConfirmationCtrl'
                        }
                    },
                    resolve: {
                        isAuthenticated: ['AuthSvc', function(AuthSvc){
                            return AuthSvc.isAuthenticated();
                        }]
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
                        account: ['AccountSvc', function(AccountSvc) {
                            return AccountSvc.account();
                        }],
                        addresses: ['AccountSvc', function(AccountSvc) {
                            return AccountSvc.getAddresses().then(
                                function (response) {
                                    return response;
                                },
                                function () {
                                    return [];
                                }
                            );
                        }],
                        orders: ['OrderListSvc', function(OrderListSvc) {
                            var parms = {
                                pageSize: 10
                            };
                            return OrderListSvc.query(parms).then(
                                function (response) {
                                    return response;
                                },
                                function () {
                                    return [];
                                }
                            );
                        }]
                    },
                    data: {
                        auth: 'authenticated'
                    }
                })
                .state('base.changePassword', {
                    url: '/changePassword?token',
                    views: {
                        'main@': {
                            templateUrl: 'js/app/auth/templates/password-reset.html',
                            controller: 'ResetPasswordUpdateCtrl'
                        }
                    }
                })
                .state('base.changeEmail', {
                    url: '/changeEmail?token',
                    views: {
                        'main@': {
                            templateUrl: 'js/app/account/templates/change-email-confirmation.html',
                            controller: 'ChangeEmailConfirmationCtrl'
                        }
                    }
                })
                .state('base.deleteAccount', {
                    url: '/custDelete?token',
                    views: {
                        'main@': {
                            controller: 'DeleteAccountCtrl'
                        }
                    }
                })
                .state('base.orderDetail', {
                    url: '/orderDetail/:orderId',
                    views: {
                        'main@': {
                            templateUrl: 'js/app/account/templates/order-detail.html',
                            controller: 'AccountOrderDetailCtrl'
                        }
                    },
                    resolve: {
                        order: ['$stateParams', 'OrdersREST', function ($stateParams, OrdersREST) {
                            return OrdersREST.Orders.one('orders', $stateParams.orderId).get()
                                .then(function (result) {
                                    window.scrollTo(0, 0);
                                    result.id = $stateParams.id;
                                    return result;
                                });
                        }]
                    },
                    data: {
                        auth: 'authenticated'
                    }
                })
                .state('errors', {
                    url: '/errors/:errorId',
                    views: {
                        'main@': {
                            templateUrl: 'js/app/errors/templates/error-display.html',
                            controller: 'ErrorsCtrl'
                        }
                    }
                });

            $urlRouterProvider.otherwise('/home');

            /* Code from angular ui-router to make trailing slash conditional */
            $urlRouterProvider.rule(function($injector, $location) {
                var path = $location.path();
                // Note: misnomer. This returns a query object, not a search string
                var search = $location.search();
                var params;

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


