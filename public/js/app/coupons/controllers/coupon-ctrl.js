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
            $scope.applyCoupon = function(code, fieldInvalid) {
                if( isValidCouponCode(fieldInvalid) ) {
                    $scope.removeErrorBlock();
                    $scope.coupon = CouponSvc.getCoupon(code).then(function (couponGetResponse) {
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
                        //Restart coupon code to empty string
                        $scope.couponCode = '';
                    }, function (couponGetError) {
                        getCouponError(couponGetError);
                    });
                }
            };

            $scope.removeCoupon = function(couponId) {
                CartSvc.removeCoupon($scope.cart.id, couponId).then(function () {
                    $scope.removeErrorBlock();
                });
            };

            $scope.removeAllCoupons = function() {
                CartSvc.removeAllCoupons($scope.cart.id).then(function () {
                    $scope.removeErrorBlock();
                });
            };

            $scope.removeErrorBlock = function () {
                if($scope.coupon && $scope.coupon.error) {
                    $scope.coupon.error = '';
                }

                if($scope.couponErrorMessage) {
                    $scope.couponErrorMessage = '';
                }
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
                var errorMessages = CouponSvc.redeemCouponError(couponError);
                // Just display the first coupon error message
                $scope.couponErrorMessage = errorMessages[0];
            };

            var isValidCouponCode = function (fieldInvalid) {
                if(fieldInvalid){
                    $scope.couponErrorMessage = $translate.instant('COUPON_NOT_VALID');
                    return false;
                }
                return true;
            };
        }]);
