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
 *  Encapsulates access to the "authorization" service.
 */
angular.module('ds.coupon')
    .factory('CouponSvc', ['$q', 'SiteConfigSvc', 'CouponREST', 'CartREST',
        function($q, siteConfig, CouponREST, CartREST){


        return {

            /**
             * Gets a coupon object as a response to user coupon entry code.
             * then validates that coupon, to either apply it to cart or invalidate it.
             */
             validateCoupon: function( couponCode ) {
                var self = this;
                var deferred = $q.defer();
                if (couponCode) {
                    // get coupon from code
                    CouponREST.Coupon.one('coupons', couponCode).get().then(function (resp) {
                            var couponData = resp.plain();
                            var couponRequest = self.buildCouponRequest(couponCode);
                            // validate coupon
                            CouponREST.Coupon.one('coupons', couponCode).customPOST(couponRequest, 'validation').then(function () {
                                    deferred.resolve(couponData);
                                }, function (resp) {
                                    deferred.reject(resp);
                                });
                        }, function (resp) {
                            deferred.reject(resp);
                        });
                } else {
                    deferred.reject();
                }
                return deferred.promise;
             },

            /**
             * Redeems a valid customer coupon, then posts it to the current cart, before final checkout.
             * Checkout will fail if posted total and checkout total do not match.
             */
             redeemCoupon: function( couponObj, cartId ) {

                var deferred = $q.defer();
                var couponCode = couponObj.code;
                if (couponCode) {
                    var self = this;
                    var couponRequest = this.buildCouponRequest(couponCode);

                    // redeem the currently valid coupon.
                    CouponREST.Coupon.one('coupons', couponCode).customPOST( couponRequest, 'redemptions').then(function (resp) {
                        var couponId = resp.plain().id;
                        var couponCartRequest = self.buildCouponCartRequest(couponObj, couponId);
                        //  post coupon redemption to cart
                        CartREST.Cart.one('carts', cartId).customPOST( couponCartRequest, 'discounts').then(function () {
                                deferred.resolve();
                            }, function () {
                                deferred.reject();
                            });

                        }, function () {
                            deferred.reject();
                        });

                } else {
                    deferred.reject();
                }
                return deferred.promise;
             },

            buildCouponCartRequest: function( couponObj, couponId ){
                return {
                            'id': couponId,
                            'code': couponObj.code,
                            'amount': couponObj.amounts.discountAmount,
                            'name': couponObj.name,
                            'currency': 'USD',
                            'sequenceId': '1', //increment for multiple coupons.
                            'calculationType': 'ApplyDiscountBeforeTax',
                            'link': {
                                'id': couponId,
                                'type': 'COUPON',
                                'url': 'http://localhost/coupons/'+couponId
                            }
                    };
            },

            buildCouponRequest: function( couponCode ){
                return {
                        'orderCode': couponCode,
                        'orderTotal': {
                            'currency': 'USD',
                            'amount': 49.99
                        },
                        'discount': {
                            'currency': 'USD',
                            'amount': 10
                        }
                        //! check out removing this discount here.
                    };
            }

        };

    }]);