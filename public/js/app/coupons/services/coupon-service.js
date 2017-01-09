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
    .factory('CouponSvc', ['CartSvc', 'CouponREST', '$translate',
        function(CartSvc, CouponREST, $translate) {

            return {

                getCoupon: function(couponCode) {
                    return CouponREST.Coupon.one('coupons', couponCode).get();
                },

                redeemCouponError: function(couponError) {

                    if (couponError.status === 400 && !!couponError.data && !!couponError.data.details) {
                        // Look for the COUPON error(s) by code, defined here:
                        //https://devportal.yaas.io/services/coupon/latest/index.html#ValidateCouponRedemption
                        // This is built to work with multiple coupon errors
                        var filteredMessages = couponError.data.details
                            .filter(function(msg) {
                                if (
                                    msg.type === 'coupon_not_active' ||
                                    msg.type === 'coupon_expired' ||
                                    msg.type === 'coupon_redemptions_exceeded' ||
                                    msg.type === 'coupon_redemption_forbidden' ||
                                    msg.type === 'coupon_order_total_too_low' ||
                                    msg.type === 'coupon_currency_incorrect' ||
                                    msg.type === 'coupon_discount_currency_incorrect' ||
                                    msg.type === 'coupon_discount_amount_incorrect'
                                ) {
                                    return true;
                                }
                                else {
                                    return false;
                                }
                            })
                            .map(function(msg) {
                                return $translate.instant(msg.type.toUpperCase());
                            });

                        return filteredMessages;
                    }
                    else {
                        var error = $translate.instant('COUPON_ERROR');
                        return [error];
                    }
                }
            };

        }]);