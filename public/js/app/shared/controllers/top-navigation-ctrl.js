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
    .controller('TopNavigationCtrl', ['$scope', '$rootScope', '$state', '$controller', 'GlobalData', 'CartSvc', 'AuthSvc', 'AuthDialogManager', 'CategorySvc', 'settings', 'Google',

        function ($scope, $rootScope, $state, $controller, GlobalData, CartSvc, AuthSvc, AuthDialogManager, CategorySvc, settings, Google) {

            $scope.GlobalData = GlobalData;
            $scope.categories = CategorySvc.getCategoriesFromCache();

            $scope.isAuthenticated = AuthSvc.isAuthenticated;
            $scope.user = GlobalData.user;

            function resetAvatarImg () {
                $scope.userAvatar = settings.avatarImagePlaceholder;
            }

            if (GlobalData.customerAccount  && GlobalData.customerAccount.accounts[0].providerId === 'google') {
                Google.getUser().then(function (user) {
                    if (user.image) {
                        $scope.userAvatar = user.image;
                    } else {
                        resetAvatarImg();
                    }
                });
                $scope.googleSignedIn = true;
            } else {
                Google.loadData();
                $scope.googleSignedIn = false;
                resetAvatarImg();
            }

            var unbindCats = $rootScope.$on('categories:updated', function(eve, obj){
                if(!$scope.categories || obj.source === settings.eventSource.languageUpdate){
                    $scope.categories = obj.categories;
                }
            });


            $scope.cart =  CartSvc.getLocalCart();
            var unbind = $rootScope.$on('cart:updated', function (eve, eveObj) {
                $scope.cart = eveObj.cart;
            });

            var unbindSocialLogin = $rootScope.$on('user:socialLogIn', function(eve, eveObj){
                if (eveObj.socialImg) {
                    $scope.userAvatar = eveObj.socialImg;
                }
                if (eveObj.provider === 'google') {
                    $scope.googleSignedIn = true;
                }
            });

            var unbindSocialLogout = $rootScope.$on('user:socialLogOut', function () {
                resetAvatarImg();
            });

            $scope.$on('$destroy', unbind);
            $scope.$on('$destroy', unbindCats);
            $scope.$on('$destroy', unbindSocialLogin);
            $scope.$on('$destroy', unbindSocialLogout);

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
                if (GlobalData.customerAccount.accounts[0].providerId === 'google') {
                    Google.logout();
                }
                AuthSvc.signOut();
            };
            
            $scope.login = function(dOpts, opts) {
                AuthDialogManager.open(dOpts, opts);
            };

            $scope.myAccount = function() {
                $state.go('base.account');
            };

        }]);