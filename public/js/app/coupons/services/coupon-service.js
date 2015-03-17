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
    .factory('CouponSvc', ['$q', 'SiteConfigSvc', 'CouponREST', 'CartREST', 'GlobalData',
        function($q, siteConfig, CouponREST, CartREST, GlobalData){

        return {
            /**
             * Gets a coupon object as a response to user coupon entry code.
             * then validates that coupon, to either apply it to cart or invalidate it.
             */
             validateCoupon: function( couponCode, totalPrice ) {
                var self = this;
                var deferred = $q.defer();
                if (couponCode) {
                    // get coupon from code
                    CouponREST.Coupon.one('coupons', couponCode).get().then(function (resp) {
                            var couponData = resp.plain();
                            var discountAmount = (couponData.discountType === "ABSOLUTE") ? couponData.discountAbsolute.amount : couponData.discountPercentage * 0.01 * totalPrice;
                            var couponRequest = self.buildCouponRequest(couponCode, GlobalData.getCurrencyId(), totalPrice, discountAmount);
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
             redeemCoupon: function( couponObj, cartId, cartTotal ) {

                var deferred = $q.defer();
                var couponCode = couponObj.code;
                if (couponCode) {
                    var self = this;
                    var couponRequest = this.buildCouponRequest(couponCode, GlobalData.getCurrencyId(), cartTotal, couponObj.amounts.discountAmount);

                    // redeem the currently valid coupon.
                    CouponREST.Coupon.one('coupons', couponCode).customPOST( couponRequest, 'redemptions').then(function (resp) {
                        var couponId = resp.plain().id;
                        var couponCartRequest = self.buildCouponCartRequest(couponObj, couponId, GlobalData.getCurrencyId());
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

            buildCouponCartRequest: function( couponObj, couponId, currencyType ){
                return {
                            'id': couponId,
                            'code': couponObj.code,
                            'amount': couponObj.amounts.discountAmount,
                            'name': couponObj.name,
                            'currency': currencyType,
                            'sequenceId': '1', //increment for multiple coupons.
                            'calculationType': 'ApplyDiscountBeforeTax', // TODO with tax.
                            'link': {
                                'id': couponId,
                                'type': 'COUPON',
                                'url': 'http://localhost/coupons/'+couponId
                            }
                    };
            },

            buildCouponRequest: function( couponCode, currencyType, totalAmount, discountAmount ){
                return {
                        'orderCode': couponCode,
                        'orderTotal': {
                            'currency': currencyType,
                            'amount': totalAmount
                        },
                        'discount': {
                            'currency': currencyType,
                            'amount': discountAmount
                        }
                    };
            }

        };

    }]);