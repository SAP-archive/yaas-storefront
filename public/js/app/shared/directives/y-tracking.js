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
    //.constant('yTrackingURL', 'https://piwik-service-v1-green.stage.cf.hybris.com')
    //.constant('yTrackingURL', 'http://piwik-service-v1-green.stage.cf.hybris.com/events')
    .constant('yTrackingLocalStorageKey', 'ytracking')
    .directive('ytracking',['ytrackingSvc' ,'$rootScope' ,
        function(ytrackingSvc, $rootScope) {
        return {
            restrict: 'A',
            compile: function () {
                /*(function(open) {
                    XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {

                        if(url === yTrackingURL){

//                            open.call(this, method, url, async, user, pass);
                            $http.post(yTrackingURL,
                                {

                                }).
                                success(function() { //data, status, headers, config
                                    // this callback will be called asynchronously
                                    // when the response is available
                                }).
                                error(function() {
                                    // called asynchronously if an error occurs
                                    // or server returns response with an error status.
                                });

                            console.log(this);
                            console.log(method);
                            console.log(url);
                            console.log(async);
                            console.log(user);
                            console.log(pass);

                        }
                        else{
                            open.call(this, method, url, async, user, pass);
                        }
                    };
                })(XMLHttpRequest.prototype.open);*/


                ytrackingSvc.init();


                //Look for route change events
                $rootScope.$on('$stateChangeSuccess',
                        function () {//event, toState, toParams, fromState

                            ////Make changes to URL
                            //$window._paq.push(['trackLink', document.URL, 'link']);
                        });


                //Handlers for events
                $rootScope.$on('productLoaded', function (arg, obj) {
                    ytrackingSvc.setProductViewed(obj.sku, obj.name, !!obj.richCategory ? obj.richCategory.name : '', obj.defaultPrice.value);
                });
                $rootScope.$on('categoryLoaded', function (arg, obj) {
                    var path = [];
                    for(var i = 0; i < obj.path.length; i++){
                        path.push(obj.path[i].name);
                    }
                    ytrackingSvc.setProductViewed(path, obj.name);
                });
            }
        };
    }])
    .factory('ytrackingSvc', ['yTrackingURL', 'yTrackingLocalStorageKey','GlobalData', '$http', 'localStorage','$window',
        function (yTrackingURL, yTrackingLocalStorageKey, GlobalData, $http, localStorage, $window) {

        //Private methods
        var getQueryParameters = function(hash) {
            var split = hash.split('&');

            var obj = {};
            for(var i = 0; i < split.length; i++){
                var kv = split[i].split('=');
                obj[kv[0]] = decodeURIComponent(kv[1] ? kv[1].replace(/\+/g, ' ') : kv[1]);
            }
            return obj;
        };


        var processRequest = function (e) {

            makeRequest(e);
        };

        var makeRequest = function (params) {

            ////get object from query parameters
            var obj = getQueryParameters(params);
            console.log(obj);

            var req = {
                method: 'POST',
                url: yTrackingURL,
                headers: {
                    'Content-Type': 'application/json, text/plain'
                },
                data: obj
            };

            //var req = {
            //    method: 'GET',
            //    url: yTrackingURL + '/?' + params,
            //    headers: {
            //        'Content-Type': 'application/json, text/plain'
            //    }
            //    //,
            //    //params: params
            //};

            $.ajax({
                type: 'POST',
                url: yTrackingURL,
                data: obj,
                //dataType: 'application/json'
                dataType: 'application/json'
            });

            $http(req).
                success(function() {
                    //Get all items that failed before and resend them to PIWIK server
                    var items = localStorage.getAllItems(yTrackingLocalStorageKey);
                    for(var i = 0; i < items.length; i++){
                        makeRequest(params);
                    }
                }).
                error(function() {
                    //Store request to localstorage so it can be sent again when possible
                    //console.log(params);
                    localStorage.addItemToArray(yTrackingLocalStorageKey, params);
                });
        };


        //Public methods

        var init = function () {
            $window._paq = $window._paq || [];

            //$window._paq.push(['setRequestContentType','application/json, text/plain']);
            //$window._paq.push(['setRequestMethod', 'POST']);
            $window._paq.push(['setCustomRequestProcessing', processRequest]);


            //Set document title
            console.log( $window.document.title.toString());
            $window._paq.push(['setDocumentTitle', $window.document.title.toString()]);

            //Set user id to equal the user token
            //console.log(TokenSvc.getToken().getAccessToken());
            //$window._paq.push(['setUserId', TokenSvc.getToken().getAccessToken().toString()]);


            $window._paq.push(['setTrackerUrl', yTrackingURL]);
            $window._paq.push(['setSiteId', 1]);


            $window._paq.push(['trackPageView']);
            $window._paq.push(['enableLinkTracking']);
        };

        var setCustomUrl = function (){
            $window._paq.push(['setCustomUrl', $window.document.URL]);
        };

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

                this.setCustomUrl();

                $window._paq.push(['setEcommerceView',
                    sku, // (required) SKU: Product unique identifier
                    name, // (optional) Product name
                    category, // (optional) Product category, or array of up to 5 categories
                    price // (optional) Product Price as displayed on the page
                ]);
                $window._paq.push(['trackPageView', name]);
            }
        };

        var setCategoryViewed = function (categoryPage, name) {
            if(!!$window._paq) {

                this.setCustomUrl();

                $window._paq.push(['setEcommerceView',
                    false, // No product on Category page
                    false, // No product on Category page
                    categoryPage // Category Page, or array of up to 5 categories
                ]);
                $window._paq.push(['trackPageView', name]);
            }
        };

        //trackEvent(category, action, [name], [value])
        var trackEvent = function (category, action, name, value) {
            if(!!$window._paq) {
                $window._paq.push(['trackEvent',
                    category,
                    action,
                    name,
                    value
                ]);
                $window._paq.push(['trackPageView', 'trackEvent']);
            }
        };

        return{
            init: init,
            trackEvent: trackEvent,
            productOrdered: productOrdered,
            orderPlaced: orderPlaced,
            setProductViewed: setProductViewed,
            setCategoryViewed: setCategoryViewed,
            setCustomUrl: setCustomUrl
        };
    }]);
