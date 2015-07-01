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
    .controller('CouponCtrl', ['$scope', '$rootScope', 'CartSvc', 'CouponSvc', 'AuthSvc', '$filter', 'GlobalData',
        function($scope, $rootScope, CartSvc, CouponSvc, AuthSvc, $filter, GlobalData) {

            $scope.cart = CartSvc.getLocalCart();

            $scope.couponCollapsed = true;

            var unbind = $rootScope.$on('cart:updated', function(eve, eveObj){
                $scope.cart = eveObj.cart;
                $scope.currencySymbol = GlobalData.getCurrencySymbol($scope.cart.currency);
            });

            $scope.$on('$destroy', unbind);

            /** get coupon and apply it to the cart */
            $scope.applyCoupon = function(couponCode) {
                $scope.coupon = CouponSvc.getCoupon(couponCode).then(function (couponResponse) {
                    CouponSvc.redeemCoupon(couponResponse, $scope.cart.id);
                }, function (couponError) {
                    getCouponError(couponError);
                });
            };

            $scope.removeAllCoupons = function() {
                CouponSvc.removeAllCoupons($scope.cart.id);
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
