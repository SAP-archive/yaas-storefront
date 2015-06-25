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

angular.module('ds.coupon')
    .controller('CouponCtrl', ['$scope', 'CartSvc', 'CouponSvc', 'AuthSvc', '$filter',
        function($scope, CartSvc, CouponSvc, AuthSvc, $filter) {

            $scope.cart = CartSvc.getLocalCart();

            $scope.couponCollapsed = true;

            /** get coupon and apply it to the cart */
            $scope.applyCoupon = function(couponCode) {
                $scope.coupon = CouponSvc.getCoupon(couponCode).then(function (couponResponse) {
                    $scope.couponErrorMessage = '';
                    CouponSvc.redeemCoupon(couponResponse, $scope.cart.id).then(function () {
                        CartSvc.getCart().then(function (response) {
                            $scope.cart = response;
                        });
                    });
                }, function (couponError) {
                    getCouponError(couponError);
                });
            };

            $scope.removeAllCoupons = function() {
                CouponSvc.removeAllCoupons($scope.cart.id).then(function () {
                    CartSvc.getCart().then(function (response) {
                        $scope.cart = response;
                    });
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
