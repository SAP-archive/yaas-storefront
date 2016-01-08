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

angular.module('ds.shared')
/** Handles interactions with the top menu (mobile menu, mobile search, mobile cart & full screen cart icon) */
    .controller('TopNavigationCtrl', ['$scope', '$rootScope', '$state', '$controller', 'GlobalData', 'CartSvc', 'AuthSvc', 'AuthDialogManager', 'CategorySvc', 'settings',

        function ($scope, $rootScope, $state, $controller, GlobalData, CartSvc, AuthSvc, AuthDialogManager, CategorySvc, settings) {

            $scope.GlobalData = GlobalData;
            $scope.categories = CategorySvc.getCategoriesFromCache();

            $scope.isAuthenticated = AuthSvc.isAuthenticated;
            $scope.user = GlobalData.user;

            var unbindCats = $rootScope.$on('categories:updated', function(eve, obj){
                if(!$scope.categories || obj.source === settings.eventSource.languageUpdate){
                    $scope.categories = obj.categories;
                }
            });


            $scope.cart =  CartSvc.getLocalCart();
            var unbind = $rootScope.$on('cart:updated', function (eve, eveObj) {
                $scope.cart = eveObj.cart;
            });

            $scope.$on('$destroy', unbind);
            $scope.$on('$destroy', unbindCats);

            /** Toggles the "show cart view" state as the cart icon is clicked. Note that this is the
             * actual cart details display, not the icon. */
            $scope.toggleCart = function () {
                if (!$rootScope.showCart) {
                    AuthDialogManager.close();
                }
                $rootScope.showCart = !$rootScope.showCart;
            };

            /** Determines if the cart icon should be displayed.*/
            $scope.isShowCartButton = function () {
                return !$state.is('base.checkout.details') && !$state.is('base.confirmation');
            };

            /** Toggles the navigation menu for the mobile view. */
            $scope.toggleOffCanvas = function () {
                $rootScope.showMobileNav = !$rootScope.showMobileNav;
            };

            $scope.logout = function() {
                var meta = document.createElement('meta');
                meta.name = 'google-signin-scope';
                meta.content = 'profile email';
                document.getElementsByTagName('head')[0].appendChild(meta);

                meta.name = 'google-signin-client_id';
                meta.content = settings.googleClientId;
                document.getElementsByTagName('head')[0].appendChild(meta);

                var s, r, t;
                r = false;
                s = document.createElement('script');
                s.type = 'text/javascript';
                s.src = 'https://apis.google.com/js/platform.js';
                s.onload = s.onreadystatechange = function() {
                    if ( !r && (!this.readyState || this.readyState === 'complete')) {
                        r = true;
                        window.gapi.load('auth2', function() {
                            var GoogleAuth  = window.gapi.auth2.getAuthInstance();
                            console.log(GoogleAuth);
                            GoogleAuth.signOut().then(function () {
                                console.log('User signed out.');
                            });
                        });
                        
                    }
                };
                t = document.getElementsByTagName('script')[0];
                t.parentNode.insertBefore(s, t);


                AuthSvc.signOut();
            };
            
            $scope.login = function(dOpts, opts) {
                AuthDialogManager.open(dOpts, opts);
            };

            $scope.myAccount = function() {
                $state.go('base.account');
            };

        }]);