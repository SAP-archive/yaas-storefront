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

angular.module('ds.cart')
    /** This controller manages the interactions of the cart view. The controller is listening to the 'cart:udpated' event
     * and will refresh the scope's cart instance when the event is received. */
    .controller('CartCtrl', ['$scope', '$state', '$rootScope', 'CartSvc', 'CouponSvc', 'GlobalData', 'settings', 'AuthSvc', 'AuthDialogManager', '$filter',
            function($scope, $state, $rootScope, CartSvc, CouponSvc, GlobalData, settings, AuthSvc, AuthDialogManager, $filter) {

        $scope.cart = CartSvc.getLocalCart();
        $scope.currencySymbol = GlobalData.getCurrencySymbol($scope.cart.currency);

        $scope.couponCollapsed = true;

        var unbind = $rootScope.$on('cart:updated', function(eve, eveObj){
            $scope.cart = eveObj.cart;
            $scope.currencySymbol = GlobalData.getCurrencySymbol($scope.cart.currency);
        });

        $scope.$on('$destroy', unbind);

        /** Remove a product from the cart.
         * @param cart item id
         * */
        $scope.removeProductFromCart = function (itemId) {
            CartSvc.removeProductFromCart(itemId);
        };

        /** Toggles the "show cart view" property.
         */
        $scope.toggleCart = function (){
            $rootScope.showCart = false;
        };

        /**
         *  Issues an "update cart" call to the service or removes the item if the quantity is undefined or zero.
         */
        $scope.updateCartItem = function (item, itemQty, config) {
            if (itemQty > 0) {
                CartSvc.updateCartItem(item, itemQty, config);
            }
            else if (!itemQty || itemQty === 0) {
                CartSvc.removeProductFromCart(item.id);
            }
        };

        $scope.toCheckoutDetails = function () {
            $scope.keepCartOpen();
            if (!AuthSvc.isAuthenticated()) {
                var dlg = AuthDialogManager.open({windowClass:'mobileLoginModal'}, {}, {}, true);

                dlg.then(function(){
                        if (AuthSvc.isAuthenticated()) {
                            $state.go('base.checkout.details');
                        }
                    },
                    function(){

                    }
                );
            }
            else {
                $state.go('base.checkout.details');
            }
        };

        /** get coupon and apply it to the cart */
        $scope.applyCoupon = function(couponCode) {
            $scope.coupon = CouponSvc.getCoupon(couponCode).then(function (couponResponse) {
                $scope.couponErrorMessage = '';
                CouponSvc.redeemCoupon(couponResponse, $scope.cart.id).then(function () {
                    CartSvc.getCart();
                });
            }, function (couponError) {
                getCouponError(couponError);
            });
        };

        $scope.removeAllCoupons = function() {
            CouponSvc.removeAllCoupons($scope.cart.id).then(function () {
                CartSvc.getCart();
            });
        };

        var getCouponError = function(couponError) {
            $scope.coupon.error = couponError;
            console.log(couponError);
            if (couponError.status === 404 || (couponError.status === 403 && AuthSvc.isAuthenticated())) {
                $scope.couponErrorMessage = $filter('translate')('COUPON_ERR_UNAVAILABLE');
            }
            else if (couponError.status === 403) {
                $scope.couponErrorMessage = $filter('translate')('COUPON_ERR_ANONYMOUS');
            }
            else if (couponError.status === 'CURR') {
                $scope.couponErrorMessage = $filter('translate')('COUPON_ERR_CURRENCY');
            }
            else {
                $scope.couponErrorMessage = $filter('translate')('COUPON_ERR_UNAVAILABLE');
            }
        };

    }]);
