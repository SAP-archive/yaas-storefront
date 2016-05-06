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
    .controller('CouponCtrl', ['$scope', '$rootScope', '$q', 'CartSvc', 'CouponSvc', 'AuthSvc', '$translate', 'GlobalData',
        function($scope, $rootScope, $q, CartSvc, CouponSvc, AuthSvc, $translate, GlobalData) {

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
            $scope.applyCoupon = function(code) {
                if( isValidCouponCode(code) ) {
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
                $scope.coupon.error = couponError;
                
                
                if (couponError.status === 400) {
                    // Look for the COUPON error(s) by code, defined here:
                    //https://devportal.yaas.io/services/coupon/latest/index.html#ValidateCouponRedemption
                    // This is built to work with multiple coupon errors
                    var filteredMessages = couponError.data.details.filter(function(msg){
                        if (
                            msg.type ===  'coupon_not_active' ||
                            msg.type ===  'coupon_expired' ||
                            msg.type ===  'coupon_redemptions_exceeded'  ||
                            msg.type ===  'coupon_redemption_forbidden' ||
                            msg.type ===  'coupon_order_total_too_low' ||
                            msg.type ===  'coupon_currency_incorrect' ||
                            msg.type ===  'coupon_discount_currency_incorrect' ||
                            msg.type ===  'coupon_discount_amount_incorrect'
                        ){
                            return true;
                        }
                        else {
                            return false;
                        }
                           
                    })
                    .map(function(msg){
                        return $translate(msg.type.toUpperCase());
                    });
                    
                    $q.all(filteredMessages).then(function(msgs){
                        $scope.couponErrorMessage = msgs.join(' and ');
                    });
                }
            };

            var isValidCouponCode = function (code) {
                if ( code.indexOf(' ') > -1) {
                    $scope.couponErrorMessage = $translate.instant('COUPON_NOT_VALID');
                    return false;
                }
                return true;
            };

        }]);
