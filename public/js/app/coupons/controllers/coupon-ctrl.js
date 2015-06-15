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
    /**
     *  Coupon Module contoller.
     */
    .controller('CouponCtrl', ['$scope','UserCoupon',
        function( $scope, UserCoupon ) {

            $scope.couponCollapsed = true;
            $scope.coupon = UserCoupon.getCoupon();

            /** load new coupon into view */
            var couponupdate = $scope.$on('coupon:updated', function(e, userCoupon) {
                $scope.coupon = userCoupon;
            });
            $scope.$on('$destroy', couponupdate);

            /** apply user coupon into cart */
            $scope.applyCoupon = function(couponCode) {

                var cartData = {};
                if(angular.isObject($scope.cart) && angular.isObject($scope.cart.subTotalPrice) && angular.isDefined($scope.cart.subTotalPrice.amount)){
                    cartData = { subTotalPrice: $scope.cart.subTotalPrice.amount };
                    UserCoupon.applyCoupon(couponCode, cartData);
                }
            };

            $scope.removeCoupon = function() {
                UserCoupon.setBlankCoupon();
            };

    }]);


