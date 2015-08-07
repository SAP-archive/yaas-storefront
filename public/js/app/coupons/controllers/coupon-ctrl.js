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
    .controller('CouponCtrl', ['$scope', '$rootScope', 'CartSvc', 'CouponSvc', 'AuthSvc', '$translate', 'GlobalData',
        function($scope, $rootScope, CartSvc, CouponSvc, AuthSvc, $translate, GlobalData) {

            $scope.cart = CartSvc.getLocalCart();

            $scope.couponCollapsed = true;

            var unbind = $rootScope.$on('cart:updated', function(eve, eveObj){
                $scope.cart = eveObj.cart;
                $scope.currencySymbol = GlobalData.getCurrencySymbol($scope.cart.currency);
            });

            var unbindSignIn = $rootScope.$on('user:signedin', function () {
                if ($scope.coupon && $scope.coupon.error && $scope.coupon.error.status === 403) {
                    delete $scope.couponErrorMessage;
                }
            });

            $scope.$on('$destroy', unbind);
            $scope.$on('$destroy', unbindSignIn);

            /** get coupon and apply it to the cart */
            $scope.applyCoupon = function(couponCode) {
                $scope.coupon = CouponSvc.getCoupon(couponCode).then(function (couponGetResponse) {
                    if (couponGetResponse.discountAbsolute && couponGetResponse.discountAbsolute.currency !== $scope.cart.currency) {
                        getCouponError({status: 'CURR'});
                    }
                    else {
                        CartSvc.redeemCoupon(couponGetResponse, $scope.cart.id).then(function () {
                            //success
                        }, function (couponRedeemError) {
                            //error
                            redeemCouponError(couponRedeemError);
                        });
                    }
                }, function (couponGetError) {
                    getCouponError(couponGetError);
                });
            };

            $scope.removeAllCoupons = function() {
                CartSvc.removeAllCoupons($scope.cart.id).then(function () {
                    $scope.coupon.error = '';
                    $scope.couponErrorMessage = '';
                });
            };

            var getCouponError = function(couponError) {
                $scope.coupon.error = couponError;
                if (couponError.status === 404 || (couponError.status === 403 && AuthSvc.isAuthenticated())) {
                    $translate('COUPON_NOT_VALID').then(function (response) {
                        $scope.couponErrorMessage = response;
                    });
                }
                else if (couponError.status === 403) {
                    $translate('COUPON_ERR_ANONYMOUS').then(function (response) {
                        $scope.couponErrorMessage = response;
                    });
                }
                else if (couponError.status === 'CURR') {
                    $translate('COUPON_ERR_CURRENCY').then(function (response) {
                        $scope.couponErrorMessage = response;
                    });
                }
                else {
                    $translate('COUPON_NOT_VALID').then(function (response) {
                        $scope.couponErrorMessage = response;
                    });
                }
            };

            var redeemCouponError = function (couponError) {
                $scope.coupon.error = couponError;
                if (couponError.status === 400) {
                    $scope.couponErrorMessage = couponError.data.details[0].message;
                }
            };

        }]);
