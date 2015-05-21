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

/**
 *  Users singleton Coupon object.
 */
angular.module('ds.coupon')
    .factory('UserCoupon', [ '$rootScope', 'CouponSvc', function( $rootScope, CouponSvc ){

        var userCoupon = {};
        var cartValues = {};
        var blankCoupon = {
            code: '',
            applied: false,
            valid: true,
            message : {  // generic coupon state messages
                //TODO: api pending generic error ids,
                error: 'Code not valid',
                success: 'Applied'
            },
            amounts : {
                discountAmount: 0
            }
        };
        userCoupon = angular.copy(blankCoupon);

        //reset coupon state
        var couponlogout = $rootScope.$on('coupon:logout', function() {
            resetCoupon();
        });
        $rootScope.$on('$destroy', couponlogout);


        /** revalidate coupon on cart change */
        var couponcartupdate = $rootScope.$on('coupon:cartupdate', function(e, cartData){
                debugger;
            // if($scope.coupon.code){
            if(userCoupon.code){
                applyCoupon(userCoupon.code, cartData)
                // $scope.applyCoupon($scope.coupon.code);
            }
        });
        $rootScope.$on('$destroy', couponcartupdate);


        function updateCoupons() {
            $rootScope.$broadcast('coupon:updated', userCoupon);
        }

        function resetCoupon() {
            userCoupon = angular.copy(blankCoupon);
            updateCoupons();
        }

        function applyCoupon(couponCode, cartData) {
            debugger;
            cartValues = cartData;

            //call coupon service to get discount.
            CouponSvc.getCoupon(couponCode).then(function (couponData, cartData) {
                var coupon = {};
                debugger;
                // $scope.coupon = UserCoupon.setCoupon(couponData);
                // coupon = that.setCoupon(couponData);
                coupon = angular.extend(userCoupon, couponData);
                // $scope.coupon.applied = true;
                coupon.applied = true;
                // $scope.coupon.valid = true;
                coupon.valid = true;

                if ( couponData.discountType === 'ABSOLUTE' ) {
                    // set discount to subtotal if it is greater than subtotal
                    if (couponData.discountAbsolute.amount > cartValues.subTotalPrice){
                        // $scope.coupon.amounts.discountAmount = $scope.cart.subTotalPrice.value;
                        coupon.amounts.discountAmount = cartValues.subTotalPrice;
                    } else {
                        // $scope.coupon.amounts.discountAmount = couponData.discountAbsolute.amount;
                        coupon.amounts.discountAmount = couponData.discountAbsolute.amount;
                    }
                }
                else if ( couponData.discountType === 'PERCENT' ) {
                    // must round percentage here in order to match service api discount comparison validation.
                    // $scope.coupon.amounts.discountAmount = parseFloat( 0.01 * couponData.discountPercentage * $scope.cart.subTotalPrice.value).toFixed(2);
                    coupon.amounts.discountAmount = parseFloat( 0.01 * couponData.discountPercentage * cartValues.subTotalPrice).toFixed(2);
                }

                updateCoupons();

            }, function (e) {  //upstream error handler.
                debugger;
                // $scope.coupon.valid = false;
                userCoupon.valid = false;
                // $scope.coupon.message.error = e.status; //show api error.
                userCoupon.message = { error : e.status }; //show api error.

                //special case until unique error type identifiers are provided.
                if (e.status === 403){
                    // $scope.coupon.message.error = 'Sign in to use coupon code';
                    userCoupon.message.error = 'Sign in to use coupon code';
                }

                updateCoupons();

            });
        }

        return {
            applyCoupon:function(couponCode, cartData){
                debugger;
                return applyCoupon(couponCode, cartData);
            },
            getCoupon:function(){
                return userCoupon;
            },
            setCoupon:function(couponData){
                updateCoupons();
                return angular.extend(userCoupon, couponData);
            },
            setBlankCoupon:function(){
                resetCoupon();
            }
        };

    }]);