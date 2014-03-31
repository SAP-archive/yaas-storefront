'use strict';

window.app = angular.module('hybris.bs&d.newborn', [
        'ngCookies',
        'ngResource',
        'ui.router',
        'hybris.bs&d.newborn.i18n',
        'hybris.bs&d.newborn.products',
        'hybris.bs&d.newborn.orders',
        'hybris.bs&d.newborn.cart',
        'hybris.bs&d.newborn.utils',
        'hybris.bs&d.newborn.shared',
        'hybris.bs&d.newborn.auth',
        'hybris.bs&d.newborn.loader'
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
                            controller: 'NavigationCtrl',
                        },
                        'shoppingcart@': {
                            templateUrl: 'public/js/app/cart/templates/cart.html',
                            controller: 'cartCtrl'
                        },
                        'signin@': {
                            templateUrl: 'public/js/app/auth/templates/signin.html',
                            controller: 'SigninCtrl'
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
                    abstract: true,
                    resolve: {
                        template: [function() {
                            return {
                                details: { templateUrl: 'public/js/app/products/templates/_details.html' },
                                form: { templateUrl: 'public/js/app/products/templates/_form.html' }
                            };
                        }],
                        editMode: function() {
                            return false;
                        },
                    }
                })

                .state('base.products.list', {
                    url: '/products',
                    resolve: {
                        products: ['Products', 'cart', function(Products, cart) {
                            var products = Products.API.query(function() {
                                angular.forEach(products, function(product) {
                                    product.showDetails = false;
                                    product.featuredImage = product.images.length && product.images[0].url || 'http://placehold.it/100x100/27394f/FFFFFF/&amp;text=No+Preview';
                                    var ci = cart.getItem(product.code);
                                    product.quantity = ci ? ci.quantity : 0;
                                });
                            });
                            return products;
                        }]
                    },
                    views: {
                        'body@': {
                            templateUrl: 'public/js/app/shared/ui/list/templates/panelsList.html',
                            controller: 'ProductsCtrl'
                        },
                        'product-tabs@base.products.list': {
                            templateUrl: 'public/js/app/products/templates/productTabs.html',
                            controller: 'ProductTabsCtrl'
                        }
                    }
                })
                .state('base.products.new', {
                    url: '/products/new',
                    views: {
                        'body@': {
                            resolve: {
                                product: ['Products', function(Product) {
                                    return new Product.API();
                                }]
                            },
                            templateUrl: 'public/js/app/shared/ui/details/templates/panelDetails.html',
                            controller: 'ProductCtrl'
                        },
                        'product-tabs@base.products.new': {
                            templateUrl: 'public/js/app/products/templates/productTabs.html',
                            controller: 'ProductTabsCtrl'
                        }
                    }
                })
                .state('base.products.edit', {
                    url: '/products/:productSku',
                    resolve: {
                        editMode: function() {
                            return true;
                        },
                        product: ['$stateParams', 'Products', function($stateParams, Products) {
                            return Products.API.get({ productSku: $stateParams.productSku });
                        }]
                    },
                    views: {
                        'body@': {
                            templateUrl: 'public/js/app/shared/ui/details/templates/panelDetails.html',
                            controller: 'ProductCtrl'
                        },
                        'product-tabs@base.products.edit': {
                            templateUrl: 'public/js/app/products/templates/productTabs.html',
                            controller: 'ProductTabsCtrl'
                        }
                    }
                })
                .state('base.orders', {
                    url: '/orders',
                    views: {
                        'body@': {
                            resolve: {
                                orders: ['Orders', function(Orders) {
                                    return Orders.API.query();
                                }]
                            },
                            templateUrl: 'public/js/app/orders/templates/orders.html',
                            controller: 'OrdersCtrl'
                        }
                    }
                })
                .state('base.orders.order', {
                    url: '/:id',
                    views: {
                        'body@': {
                            resolve: {
                                order: ['Orders', '$stateParams', 'GlobalData', function(Orders, $stateParams, GlobalData) {
                                    var order = Orders.API.get({ orderId: $stateParams.id }, function() {
                                        order._id = $stateParams.id;
                                        order.buyerId = GlobalData.buyer.id;
                                    });
                                    return order;
                                }]
                            },
                            templateUrl: 'public/js/app/orders/templates/order.html',
                            controller: 'OrderCtrl'
                        }
                    }
                });

            $urlRouterProvider.otherwise('/');
            $locationProvider.hashPrefix('!');
        }
    ])
    
    .run(['CORSProvider', 'GlobalData',
        function (CORSProvider, GlobalData) {
            CORSProvider.enableCORS(GlobalData);
        }
    ]);