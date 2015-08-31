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
 *  Provides a variety of coupon: access, validation, and redemptions services.
 */
angular.module('ds.coupon')
    .factory('CouponSvc', ['CartSvc', 'CouponREST',
        function(CartSvc, CouponREST){

            return {

                getCoupon: function (couponCode) {
                    return CouponREST.Coupon.one('coupons', couponCode).get();
                }

            };

    }]);