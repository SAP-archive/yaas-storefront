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

angular.module('ds.ytracking', [])
    .constant('yTrackingLocalStorageKey', 'ytracking')
    .directive('ytracking', ['ytrackingSvc', '$rootScope',
        function (ytrackingSvc, $rootScope) {
            return {
                restrict: 'A',
                compile: function () {

                    //Init tracking
                    ytrackingSvc.init();

                    //Handlers for events
                    $rootScope.$on('productLoaded', function (arg, obj) {

                        var name = obj.product.name || '';
                        var price = '';
                        if (!!obj.prices && !!obj.prices[0] && !!obj.prices[0].effectiveAmount) {
                            price = obj.prices[0].effectiveAmount;
                        }
                        var category = '';
                        if (!!obj.categories && !!obj.categories[0] && !!obj.categories[0].id) {
                            category = obj.categories[0].id;
                        }

                        ytrackingSvc.setProductViewed(obj.product.id, name, category, price);

                    });
                    $rootScope.$on('categoryLoaded', function (arg, obj) {
                        var path = '';
                        //For now we are only sending last category name, in future we will send array of categories
                        for (var i = 0; i < obj.path.length; i++) {
                            path = obj.path[i].name;
                        }
                        ytrackingSvc.setCategoryViewed(path);
                    });

                    ////For now we are just tracking "user viewed category/product"
                    //$rootScope.$on('orderPlaced', function (arg, obj) {
                    //    //Send ordered cart items to piwik
                    //    for(var i = 0; i < obj.cart.items.length; i++){
                    //        //sku, name, categoryName, unitPrice, amount
                    //        var item = obj.cart.items[i];
                    //        ytrackingSvc.addEcommerceItem(item.product.id, item.product.name, '',item.unitPrice.amount, item.quantity);
                    //    }
                    //    //Send order details to piwik
                    //    ytrackingSvc.orderPlaced(obj.orderId, obj.cart.totalPrice.amount, obj.cart.subTotalPrice.amount, 0, obj.cart.shippingCost.amount, false);
                    //});

                    //$rootScope.$on('cart:updated', function (arg, obj) {
                    //    ytrackingSvc.cartUpdated(obj.cart);
                    //});
                }
            };
        }])
    .factory('ytrackingSvc', ['SiteConfigSvc', 'yTrackingLocalStorageKey', '$http', 'localStorage', '$window', '$timeout', 'GlobalData',
        function (siteConfig, yTrackingLocalStorageKey, $http, localStorage, $window, $timeout, GlobalData) {

            //Url for piwik service
            var url = siteConfig.apis.tracking.baseUrl;

            //Create object from piwik GET request
            var getQueryParameters = function (hash) {
                var split = hash.split('&');

                var obj = {};
                for (var i = 0; i < split.length; i++) {
                    var kv = split[i].split('=');
                    obj[kv[0]] = decodeURIComponent(kv[1] ? kv[1].replace(/\+/g, ' ') : kv[1]);
                }
                return obj;
            };

            //Function that process piwik requests
            var processRequest = function (e) {
                //Make post request to service
                if (GlobalData.piwik.enabled) {
                    makeRequest(e);
                }
            };

            var makeRequest = function (params) {

                //Get object from query parameters
                var obj = getQueryParameters(params);

                var req = {
                    method: 'POST',
                    url: url,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    data: JSON.stringify(obj)
                };

                $http(req).
                    success(function () {
                        GlobalData.piwik.firstCall = false;

                        //Get all items that failed before and resend them to PIWIK server
                        var items = localStorage.getAllItems(yTrackingLocalStorageKey);
                        for (var i = 0; i < items.length; i++) {
                            makeRequest(items[i]);
                        }
                    }).
                    error(function () {
                        //Store request to localstorage so it can be sent again when possible
                        localStorage.addItemToArray(yTrackingLocalStorageKey, params);
                    });
            };

            //Initialization of piwik
            var init = function () {
                $window._paq = $window._paq || [];

                //Make requests to service custom
                $window._paq.push(['setCustomRequestProcessing', processRequest]);

                //Set document title
                $window._paq.push(['setDocumentTitle', 'PageViewEvent']);

                //Set user id to equal the user token
                //$window._paq.push(['setUserId', TokenSvc.getToken().getAccessToken().toString()]);

                $window._paq.push(['setTrackerUrl', url]);
                $window._paq.push(['setSiteId', GlobalData.store.tenant + '.' + GlobalData.getSiteCode()]);

                $window._paq.push(['trackPageView']);
                $window._paq.push(['enableLinkTracking']);

            };

            //Method that is setting current url
            var setCustomUrl = function () {
                if (!!$window._paq) {
                    $window._paq.push(['setCustomUrl', $window.document.URL]);
                }
            };


            var cartUpdated = function (cart) {
                //Add products to the order
                if (!!cart.items) {
                    for (var i = 0; i < cart.items.length; i++) {
                        //sku, name, categoryName, unitPrice, amount
                        var item = cart.items[i];
                        addEcommerceItem(item.product.id, item.product.name, '', item.price.amount, item.quantity);
                    }
                }

                //Records the cart for this visit
                $window._paq.push(['trackEcommerceCartUpdate', !!cart.totalPrice ? cart.totalPrice.amount : 0]); // (required) Cart amount
                $window._paq.push(['trackPageView', 'CartUpdated']);
            };

            var addEcommerceItem = function (sku, name, categoryName, price, amount) {
                if (!!$window._paq) {
                    $window._paq.push(['addEcommerceItem',
                        sku, // (required) SKU: Product unique identifier
                        name, // (optional) Product name
                        categoryName, // (optional) Product category. You can also specify an array of up to 5 categories eg. ["Books", "New releases", "Biography"]
                        price, // (recommended) Product price
                        amount // (optional, default to 1) Product quantity
                    ]);
                }
            };

            var orderPlaced = function (orderId, orderGrandTotal, orderSubTotal, taxAmount, shippingAmount, isDiscountOffered) {
                if (!!$window._paq) {
                    $window._paq.push(['trackEcommerceOrder',
                        orderId, // (required) Unique Order ID
                        orderGrandTotal, // (required) Order Revenue grand total (includes tax, shipping, and subtracted discount)
                        orderSubTotal, // (optional) Order sub total (excludes shipping)
                        taxAmount, // (optional) Tax amount
                        shippingAmount, // (optional) Shipping amount
                        isDiscountOffered // (optional) Discount offered (set to false for unspecified parameter)
                    ]);

                    $window._paq.push(['trackPageView', 'OrderPlaced']);
                }
            };

            var setProductViewed = function (sku, name, category, price) {
                if (!!$window._paq) {
                    //Wait current digest loop to finish, and then when the page is changed update values to PIWIK
                    $timeout(function () {
                        setCustomUrl();

                        $window._paq.push(['setEcommerceView',
                            sku, //(required) SKU: Product unique identifier
                            name, //(optional) Product name
                            category, //(optional) Product category, or array of up to 5 categories
                            price //(optional) Product Price as displayed on the page
                        ]);

                        $window._paq.push(['trackPageView', 'ViewProduct']);
                    });
                }
            };

            var setCategoryViewed = function (categoryPage) {
                if (!!$window._paq) {
                    //Wait current digest loop to finish, and then when the page is changed update values to PIWIK
                    $timeout(function () {
                        setCustomUrl();

                        $window._paq.push(['setEcommerceView',
                            false, //No product on Category page
                            false, //No product on Category page
                            categoryPage // Category Page, or array of up to 5 categories
                        ]);

                        $window._paq.push(['trackPageView', 'ViewCategory']);
                    });
                }
            };

            var trackEvent = function (category, action, name, value) {
                if (!!$window._paq) {
                    $window._paq.push(['trackEvent',
                        category,
                        action,
                        name,
                        value
                    ]);

                    $window._paq.push(['trackPageView', 'trackEvent']);
                }
            };

            return {
                cartUpdated: cartUpdated,
                init: init,
                trackEvent: trackEvent,
                addEcommerceItem: addEcommerceItem,
                orderPlaced: orderPlaced,
                setProductViewed: setProductViewed,
                setCategoryViewed: setCategoryViewed,
                setCustomUrl: setCustomUrl
            };
        }]);
