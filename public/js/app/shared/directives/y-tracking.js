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
    .directive('ytracking', ['ytrackingSvc', '$rootScope', '$document',
        function (ytrackingSvc, $rootScope, $document) {
            return {
                restrict: 'A',
                compile: function () {

                    //Init tracking
                    ytrackingSvc.init();

                    //Handlers for events
                    $rootScope.$on('product:opened', function (arg, obj) {

                        var name = !!obj.product && !!obj.product.name ? obj.product.name : '';
                        var category = !!obj.categories && !!obj.categories[0] ? obj.categories[0].name : '';
                        var price = !!obj.prices && !!obj.prices[0] ? obj.prices[0].effectiveAmount : '';

                        ytrackingSvc.setProductViewed(obj.product.id, name, category, price);
                    });
                    $rootScope.$on('category:opened', function (arg, obj) {
                        var path = '';
                        //For now we are only sending last category name, in future we will send array of categories
                        for (var i = 0; i < obj.path.length; i++) {
                            path = obj.path[i].name;
                        }
                        ytrackingSvc.setCategoryViewed(path);
                    });

                    $rootScope.$on('customer:login', function (arg, customer) {
                        ytrackingSvc.customerLogIn(customer);
                    });

                    $rootScope.$on('search:performed', function (arg, obj) {
                        ytrackingSvc.searchEvent(obj.searchTerm, obj.numberOfResults);
                    });

                    $rootScope.$on('checkout:opened', function (arg, cart) {
                        ytrackingSvc.proceedToCheckout(cart);
                    });

                    $rootScope.$on('order:placed', function (arg, obj) {
                        //Send ordered cart items to piwik
                        for (var i = 0; i < obj.cart.items.length; i++) {
                            //sku, name, categoryName, unitPrice, amount
                            var item = obj.cart.items[i];
                            var price = !!item.itemPrice && !!item.itemPrice.amount ? item.itemPrice.amount : '';
                            ytrackingSvc.addEcommerceItem(item.product.id, item.product.name, '', price, item.quantity);
                        }
                        //Send order details to piwik
                        var orderId = obj.orderId || '';
                        var totalPrice = !!obj.cart && !!obj.cart.totalPrice ? obj.cart.totalPrice.amount : '';
                        var subTotalPrice = !!obj.cart && !!obj.cart.subTotalPrice.amount ? obj.cart.subTotalPrice.amount : '';
                        var tax = !!obj.cart && !!obj.cart.totalTax ? obj.cart.totalTax.amount : '';
                        var shippingCost = !!obj.cart && !!obj.cart.shippingCost ? obj.cart.shippingCost.amount : '';
                        var discountOffered = false;

                        ytrackingSvc.orderPlaced(orderId, totalPrice, subTotalPrice, tax, shippingCost, discountOffered);
                    });

                    $rootScope.$on('cart:updated', function (arg, obj) {
                        ytrackingSvc.cartUpdated(obj.cart);
                    });

                    // This should be maybe changed, and user should put ng-click to all banners that we want to look for
                    // or say to user to give to all banners that they want to follow specific class
                    $document.on('click', '.banner', function () {
                        var element = angular.element(this);
                        var id = element.attr('id') || '';
                        var url = element.attr('href') || '';

                        ytrackingSvc.bannerClick(id, url);
                    });
                }
            };
        }])
    .factory('ytrackingSvc', ['yTrackingLocalStorageKey', '$http', 'localStorage', '$window', '$timeout', 'GlobalData', 'settings', 'appConfig', 'CookieSvc',
        function (yTrackingLocalStorageKey, $http, localStorage, $window, $timeout, GlobalData, settings, appConfig, CookieSvc) {

            var internalCart = {};

            /**
            * Url for piwik service.
            * appConfig dependency should be refactored out maybe and tenant and domain
            * should be provided for example as parameters to ytracking directive so this tracking
            * can also work for any other storefront (not just this template)
            */
            var apiPath = appConfig.dynamicDomain();
            var tenantId = appConfig.storeTenant();
            
            var piwikUrl = 'https://' + apiPath + '/hybris/profile-edge/v1' + '/events';
            var consentUrl = 'https://' + apiPath + '/hybris/profile-consent/v1/' + tenantId + '/consentReferences';

            var getConsentReference = function () {
                var consentReferenceCookie = CookieSvc.getConsentReferenceCookie();
                if (!!consentReferenceCookie) {
                    return consentReferenceCookie;
                } else {
                    return '';
                }
            };

            // We could do this in ConfigSvc. This way, consent-reference will be fetched before piwik starts tracking and sending
            // events. When done in ConfigSvc then the code should probably also detect if ytracking is enabled before attmepting
            // to fetch the consent-reference.
            var makeOptInRequest = function() {
                var req = {
                    method: 'POST',
                    url: consentUrl,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                };

                return $http(req);
            };

            /**
            * Create object from piwik GET request
            */
            var getPiwikQueryParameters = function (hash) {
                var split = hash.split('&');

                var obj = {};
                for (var i = 0; i < split.length; i++) {
                    var kv = split[i].split('=');
                    obj[kv[0]] = decodeURIComponent(kv[1] ? kv[1].replace(/\+/g, ' ') : kv[1]);
                }

                //Set date for this request to current datetime when request processed. Needed from CDM for order of events.
                obj.date = new Date().getTime();

                return obj;
            };

            /**
            * Function that process piwik requests
            */
            var processPiwikRequest = function (e) {

                //Get object from query parameters
                var obj = getPiwikQueryParameters(e);


                /*
                 if no consent reference cookie present, we must get the consent reference before making the
                 first call to the tracking endpoint
                 */
                if (!getConsentReference()) {
                    //noinspection JSUnusedAssignment
                    makeOptInRequest().success(function (response) {
                        if (!!response.id) {
                            CookieSvc.setConsentReferenceCookie(response.id);
                        }
                        //Make post request to service
                        makePiwikRequest(obj);
                    });
                }
                else {
                    //Make post request to service
                    makePiwikRequest(obj);
                }
            };

            /**
            * Function that creates POST request to CDM endpoint
            */
            var makePiwikRequest = function (obj) {

                var req = {
                    method: 'POST',
                    url: piwikUrl,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'consent-reference': getConsentReference()
                    },
                    data: JSON.stringify(obj)
                };

                //pass 'piwik' as event type if the tracking endpoint is the edge endpoint
                if (piwikUrl.indexOf('edge') >= 0) {
                    req.headers['event-type'] = 'piwik';
                    req.headers[settings.headers.hybrisTenant] = appConfig.storeTenant();
                }

                $http(req).success(function () {
                    //Get all items that failed before and resend them to PIWIK server
                    var items = localStorage.getAllItems(yTrackingLocalStorageKey);
                    for (var i = 0; i < items.length; i++) {
                        makePiwikRequest(items[i]);
                    }
                }).error(function () {
                    //Store request to localstorage so it can be sent again when possible
                    localStorage.addItemToArray(yTrackingLocalStorageKey, obj);
                });

            };

            /**
            * Initialization of piwik
            */
            var init = function () {
                $window._paq = $window._paq || [];

                //Make requests to service custom
                $window._paq.push(['setCustomRequestProcessing', processPiwikRequest]);

                //Set document title
                $window._paq.push(['setDocumentTitle', 'PageViewEvent']);

                //Set user id to equal the user token
                //$window._paq.push(['setUserId', TokenSvc.getToken().getAccessToken().toString()]);

                $window._paq.push(['setTrackerUrl', piwikUrl]);

                //Add site code. It should be   <tenant>.<siteCode>
                $window._paq.push(['setSiteId', GlobalData.store.tenant + '.' + GlobalData.getSiteCode()]);

                $window._paq.push(['trackPageView']);
                $window._paq.push(['enableLinkTracking']);

            };

            /**
            * Method that is setting current url
            */
            var setCustomUrl = function () {
                if (!!$window._paq) {
                    $window._paq.push(['setCustomUrl', $window.document.URL]);
                }
            };

            /**
            * User viewed product
            */
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

                        $window._paq.push(['trackPageView', 'ProductDetailPageViewEvent']);
                    });
                }
            };

            /**
            * User viewed category
            */
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

                        $window._paq.push(['trackPageView', 'CategoryPageViewEvent']);
                    });
                }
            };

            /**
            * User searched event
            */
            //Category missing? There is no way to set SearchEvent and SearchNoResultsEvent as action_view
            var searchEvent = function (searchTerm, numberOfResults) {
                if (!!$window._paq) {
                    if (numberOfResults > 0) {
                        $window._paq.push(['trackSiteSearch',
                            searchTerm,
                            false, //This is search category selected in our search. At the moment we dont have this
                            numberOfResults
                        ]);
                    }
                    else {
                        $window._paq.push(['trackSiteSearch',
                            searchTerm,
                            false, //This is search category selected in our search. At the moment we dont have this
                            0
                        ]);
                    }
                }
            };

            /**
            * User clicked on element with class  banner
            */
            var bannerClick = function (bannerId, url) {
                if (!!$window._paq) {
                    $timeout(function () {
                        setCustomUrl();
                        $window._paq.push(['setCustomVariable', 1, bannerId, url, 'page']);
                        $window._paq.push(['trackLink', 'BannerClickEvent', 'action_name']);
                    });
                }
            };

            /**
            * User updated cart
            */
            var cartUpdated = function (cart) {
                var i = 0;
                //Check if there is some item that is removed in new cart??
                if (!!internalCart.items) {
                    if (!!cart.items) {

                        var productFound = false;
                        for (i = 0; i < internalCart.items.length; i++) {
                            //Check if this item exists in new cart
                            for (var j = 0; j < cart.items.length; j++) {
                                if (internalCart.items[i].product.id === cart.items[j].product.id) {
                                    productFound = true;
                                    break;
                                }
                            }
                            if (!productFound) {
                                //If it didn't break before that means that the item is not found and deleted
                                addEcommerceItem(internalCart.items[i].product.id, internalCart.items[i].product.name, '', internalCart.items[i].itemPrice.amount, 0);
                            }
                            productFound = false;
                        }
                    }
                    else {
                        //All items are removed
                        for (i = 0; i < internalCart.items.length; i++) {
                            addEcommerceItem(internalCart.items[i].product.id, internalCart.items[i].product.name, '', internalCart.items[i].itemPrice.amount, 0);
                        }
                    }
                }

                if (!!cart.items) {
                    for (i = 0; i < cart.items.length; i++) {
                        //sku, name, categoryName, unitPrice, amount
                        var item = cart.items[i];
                        addEcommerceItem(item.product.id, item.product.name, '', item.itemPrice.amount, item.quantity);
                    }
                }

                //Records the cart for this visit
                var cartId = getCartId(cart);
                $window._paq.push(['setCustomVariable', 1, 'cart_id', cartId, 'page']);
                $window._paq.push(['trackEcommerceCartUpdate', !!cart.totalPrice ? cart.totalPrice.amount : 0]); // (required) Cart amount

                //Save previous state for later comparasion (checking if objects are removed from cart)
                internalCart = cart;
            };

            /**
            * Function for adding item to cart
            */
            var addEcommerceItem = function (id, name, categoryName, unitPrice, amount) {
                if (!!$window._paq) {
                    $window._paq.push(['addEcommerceItem',
                        id, // (required) SKU: Product unique identifier
                        name, // (optional) Product name
                        categoryName, // (optional) Product category. You can also specify an array of up to 5 categories eg. ["Books", "New releases", "Biography"]
                        unitPrice, // (recommended) Product price
                        amount // (optional, default to 1) Product quantity
                    ]);
                }
            };

            /**
            * User opened checkout page
            */
            var proceedToCheckout = function (cart) {
                if (!!$window._paq) {
                    $timeout(function () {
                        setCustomUrl();

                        var cartId = getCartId(cart);
                        $window._paq.push(['setCustomVariable', 1, 'cart_id', cartId, 'page']);
                        $window._paq.push(['trackLink', 'ProceedToCheckoutEvent', 'action_name']);
                    });
                }
            };

            /**
            * User created order
            */
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
                }
            };

            /**
            * User created order
            */
            var customerLogIn = function () {
                if (!!$window._paq) {
                    $window._paq.push(['trackPageView', 'CustomerLogin']);
                }
            };
 
            var getCartId = function(cart) {
                return !!cart.id ? cart.id : '';
            };

            return {
                cartUpdated: cartUpdated,
                init: init,
                addEcommerceItem: addEcommerceItem,
                orderPlaced: orderPlaced,
                setProductViewed: setProductViewed,
                setCategoryViewed: setCategoryViewed,
                setCustomUrl: setCustomUrl,
                searchEvent: searchEvent,
                bannerClick: bannerClick,
                proceedToCheckout: proceedToCheckout,
                customerLogIn: customerLogIn
            };
        }]);
