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


angular.module('ds.ytacking', [])
    .constant('yTrackingURL', 'https://nemanjapopovic.piwikpro.com/piwik.php')
    //.constant('yTrackingURL', 'https://api.yaas.io/piwik/events')
    .directive('ytracking',['yTrackingURL', 'ytrackingSvc' ,'$rootScope' ,'GlobalData', '$window', 'TokenSvc',function(yTrackingURL, ytrackingSvc, $rootScope, GlobalData, $window, TokenSvc) {
        return {
            restrict: 'A',
            compile: function (scope) {


                (function(open) {
                    XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {
                        alert();
                        console.log(this);
                        console.log(method);
                        // Do some magic
                        open.call(this, method, url, async, user, pass);
                        var token = TokenSvc.getToken().getAccessToken();
                        if (token) {
                            this.setRequestHeader('Authorization', 'Bearer ' + token);
                        }
                    };
                })(XMLHttpRequest.prototype.open);

                scope.processRequest = function (e) {
                    console.log('before request event');
                    console.log(e);
                };

                $window._paq = $window._paq || [];


                $window._paq.push(['setRequestMethod', 'POST']);
                $window._paq.push(['setCustomRequestProcessing',scope.processRequest]);


                //Set document title
                console.log( document.title.toString());
                $window._paq.push(['setDocumentTitle', document.title.toString()]);
                //Set user id to equal the user token
                console.log(TokenSvc.getToken().getAccessToken().toString());
                $window._paq.push(['setUserId', TokenSvc.getToken().getAccessToken().toString()]);


                $window._paq.push(['setTrackerUrl', yTrackingURL]);
                $window._paq.push(['setSiteId', 1]);




                $window._paq.push(['trackPageView']);
                $window._paq.push(['enableLinkTracking']);


                //Look for route change events
                $rootScope.$on('$stateChangeSuccess',
                        function (event, toState, toParams, fromState) {


                            //$window._paq.push(['setTrackerUrl', document.URL]);

                            if(toState.name === 'base.product.detail'){
                                console.log(fromState);
                                console.log(toState);

                            }

                            if(toState.name === 'base.category'){

                                console.log(toState);
                                //ytrackingSvc.setCategoryViewed(toState.name);
                            }
                        });
            }
        };
    }])
    .factory('ytrackingSvc', ['$window', function ($window) {


        var productOrdered = function (sku, name, categoryName, unitPrice, amount) {
            if(!!$window._paq) {
                $window._paq.push(['addEcommerceItem',
                    sku, // (required) SKU: Product unique identifier
                    name, // (optional) Product name
                    categoryName, // (optional) Product category. You can also specify an array of up to 5 categories eg. ["Books", "New releases", "Biography"]
                    unitPrice, // (recommended) Product price
                    amount // (optional, default to 1) Product quantity
                ]);
            }
        };

        var orderPlaced = function (orderId, orderGrandTotal, orderSubTotal, taxAmount, shippingAmount, isDiscountOffered) {
            if(!!$window._paq) {
                $window._paq.push(['trackEcommerceOrder',
                    orderId, // (required) Unique Order ID
                    orderGrandTotal, // (required) Order Revenue grand total (includes tax, shipping, and subtracted discount)
                    orderSubTotal, // (optional) Order sub total (excludes shipping)
                    taxAmount, // (optional) Tax amount
                    shippingAmount, // (optional) Shipping amount
                    isDiscountOffered // (optional) Discount offered (set to false for unspecified parameter)
                ]);


                $window._paq.push(['trackPageView']);
            }
        };

        var setProductViewed = function (sku, name, category, price) {
            if(!!$window._paq) {
                $window._paq.push(['setEcommerceView',
                    sku, // (required) SKU: Product unique identifier
                    name, // (optional) Product name
                    category, // (optional) Product category, or array of up to 5 categories
                    price // (optional) Product Price as displayed on the page
                ]);
                $window._paq.push(['trackPageView', name]);
            }
        };

        var setCategoryViewed = function (categoryPage) {
            if(!!$window._paq) {
                $window._paq.push(['setEcommerceView',
                    false, // No product on Category page
                    false, // No product on Category page
                    categoryPage // Category Page, or array of up to 5 categories
                ]);
                $window._paq.push(['trackPageView', categoryPage]);
            }
        };

        //trackEvent(category, action, [name], [value])
        var trackEvent = function (category, action, name, value) {
            if(!!$window._paq) {
                $window._paq.push(['trackEvent',
                    'category',
                    'action',
                    'name',
                    'value'
                ]);
                $window._paq.push(['trackPageView', 'trackEvent']);
            }
        };

        return{
            trackEvent: trackEvent,
            productOrdered: productOrdered,
            orderPlaced: orderPlaced,
            setProductViewed: setProductViewed,
            setCategoryViewed: setCategoryViewed
        };
    }]);
