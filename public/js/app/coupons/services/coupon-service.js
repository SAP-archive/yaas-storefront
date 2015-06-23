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
    .factory('CouponSvc', ['CartREST', 'CouponREST',
        function(CartREST, CouponREST){

            /*
             TODO:
             this function is only necessary because the cart mashup does not directly consume the coupon as
             it is returned from the coupon service.  That may change in the future
             */
            function parseCoupon(coupon) {
                if (coupon.discountType === 'ABSOLUTE') {
                    coupon.amount = coupon.discountAbsolute.amount;
                    coupon.currency = coupon.discountAbsolute.currency;
                }
                else if (coupon.discountType === 'PERCENT') {
                    coupon.discountRate = coupon.discountPercentage;
                }

                return coupon;
            }

            return {

                getCoupon: function (couponCode) {
                    return CouponREST.Coupon.one('coupons', couponCode).get();
                },

                redeemCoupon: function (coupon, cartId) {
                    coupon = parseCoupon(coupon);
                    return CartREST.Cart.one('carts', cartId).customPOST(coupon, 'discounts');
                },

                removeCoupon: function (discountId, cartId) {
                    return CartREST.Cart.one('carts', cartId).one('discounts', discountId).remove();
                }

            };

    }]);