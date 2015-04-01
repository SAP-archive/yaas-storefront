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
    .factory('UserCoupon', [ '$rootScope', function( $rootScope ){

        var userCoupon = {};
        var blankCoupon = {
            code: '',
            applied: false,
            valid: true,
            message : {
                error: 'Code not valid',
                success: 'Applied'
            },
            amounts : {
                discountAmount: 0
            }
        };
        userCoupon = angular.copy(blankCoupon);

        function updateCoupons() {
            $rootScope.$broadcast('coupon:updated', userCoupon);
        }

        return {
            getCoupon:function(){
                return userCoupon;
            },
            setCoupon:function(couponData){
                updateCoupons();
                return angular.extend(userCoupon, couponData);
            },
            setBlankCoupon:function(){
                userCoupon = angular.copy(blankCoupon);
                updateCoupons();
            }
        };

    }]);