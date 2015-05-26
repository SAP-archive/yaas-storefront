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
    .factory('UserCoupon', [ '$rootScope', 'CouponSvc', 'AuthSvc', '$filter', function( $rootScope, CouponSvc, AuthSvc, $filter ){

        var userCoupon = {};
        var cartValues = {};
        var blankCoupon = {
            code: '',
            valid: true,
            applied: false,
            message : {  // generic coupon state messages
                error: $filter('translate')('COUPON_ERROR'),
                success: $filter('translate')('COUPON_APPLIED')
            },
            amounts : {
                discountAmount: 0
            }
        };

        // initalize blank coupon.
        userCoupon = angular.copy(blankCoupon);

        function applyCoupon(couponCode, cartData) {

            if(!setCartData(cartData)){
                return;
            }

            //call coupon service to get discount and validate.
            CouponSvc.getValidateCoupon(couponCode, cartValues.subTotalPrice).then(function (couponData) {
                userCoupon.valid = true;
                userCoupon.applied = true;

                if ( couponData.discountType === 'ABSOLUTE' ) {
                    // set discount to subtotal if it is greater than subtotal
                    if (couponData.discountAbsolute.amount > cartValues.subTotalPrice){
                        userCoupon.amounts.discountAmount = cartValues.subTotalPrice;
                    } else {
                        userCoupon.amounts.discountAmount = couponData.discountAbsolute.amount;
                    }
                }
                else if ( couponData.discountType === 'PERCENT' ) {
                    // must round percentage here in order to match service api discount comparison validation.
                    userCoupon.amounts.discountAmount = parseFloat( 0.01 * couponData.discountPercentage * cartValues.subTotalPrice).toFixed(2);
                }

                updateCoupons();

            }, function (e) {  //upstream error handler.
                userCoupon.valid = false;
                userCoupon.applied = false;
                userCoupon.amounts.discountAmount = 0;

                setCouponError(e);

                updateCoupons();
            });
        }

        function resetCoupon() {
            userCoupon = angular.copy(blankCoupon);
            updateCoupons();
        }

        function updateCoupons() {
            $rootScope.$broadcast('coupon:updated', userCoupon);
        }

        function setCartData(cartData){
            cartValues = cartData;
            // ensure cart dependency is available for validation purposes.
            if(!(angular.isDefined(cartValues) && angular.isDefined(cartValues.subTotalPrice))){
                userCoupon.valid = true;
                userCoupon.applied = false;
                userCoupon.message.error = '';
                updateCoupons();
                return false;
            }
            return true;
        }

        function setCouponError(e) {
            // set message recieved from server as default
            if(angular.isDefined(e) && angular.isDefined(e.data) && angular.isDefined(e.data.message)){
                userCoupon.message.error = e.data.message;
            }

            // set user facing error message overrides.
            if (e.status === 403 && AuthSvc.isAuthenticated()){
                userCoupon.message.error = $filter('translate')('COUPON_ERR_UNAVAILABLE');
            } else if (e.status === 403){
                userCoupon.message.error = $filter('translate')('COUPON_ERR_ANONYMOUS');
            } else if ( e.status === 'CURR'){
                userCoupon.message.error =  $filter('translate')('COUPON_ERR_CURRENCY');
            }
        }

        /* Events */
        var couponlogout = $rootScope.$on('coupon:logout', function() {
            // reset coupon state
            resetCoupon();
        });
        $rootScope.$on('$destroy', couponlogout);

        var couponcartupdate = $rootScope.$on('coupon:cartupdate', function(e, cartData){
            // revalidate coupon on cart change
            if(!!userCoupon.code){
                applyCoupon(userCoupon.code, cartData);
            }
        });
        $rootScope.$on('$destroy', couponcartupdate);


        return {
            applyCoupon:function(couponCode, cartData){
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