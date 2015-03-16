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
             * Make sure that the coupon code entered by the client can be actually used for the order.
             * Returns a promise of the service result for upstream error handling.
             */
             validateCoupon: function( couponCode ) {
                var deferred = $q.defer();
                if (couponCode) {
                    var couponRequest = this.buildCouponRequest(couponCode);

                    CouponREST.Coupon.one('coupons', couponCode).customPOST(couponRequest, 'validation').then(function () {
                            deferred.resolve();
                        }, function (resp) {
                            deferred.reject(resp);
                        });
                } else {
                    deferred.reject();
                }
                return deferred.promise;
             },

            /**
             * Retrieves coupon data for customer coupon application request.
             * Returns a promise of the result.
             */
             getDiscount: function( couponCode ) {

                var deferred = $q.defer();
                if (couponCode) {
                    //https://{domain}/coupon/v1/{tenant}/coupons/{code}
                    CouponREST.Coupon.one('coupons', couponCode).get().then(function (resp) {
                            var couponData = resp.plain();
                            deferred.resolve(couponData);
                        }, function (resp) {
                            deferred.reject(resp);
                        });
                } else {
                    deferred.reject();
                }
                return deferred.promise;
             },

            /**
             * Retrieves coupon data for customer coupon application request.
             * Returns a promise of the result.
             */
             getRedeemedCoupon: function( couponCode ) {
                var deferred = $q.defer();
                if (couponCode) {
                    //https://{domain}/coupon/v1/{tenant}/coupons/{code}/redemptions
                    CouponREST.Coupon.one('coupons', couponCode).customGET('redemptions').then(function (resp) {
                            deferred.resolve(resp);
                        }, function () {
                            deferred.reject();
                        });
                } else {
                    deferred.reject();
                }
                return deferred.promise;
             },

            /**
             * Retrieves coupon data for customer coupon application request.
             * Returns a promise of the result.
             */
             redeemCoupon: function( couponObj, cartId ) {

                var deferred = $q.defer();
                var couponCode = couponObj.code;
                if (couponCode) {
                    var self = this;
                    var couponRequest = this.buildCouponRequest(couponCode);

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
            /**
             * Retrieves coupon data for customer coupon application request.
             * Returns a promise of the result.
             */
             redeemCouponAtomic: function( couponCode ) {

                var deferred = $q.defer();
                if (couponCode) {
                    var couponRequest = this.buildCouponRequest(couponCode);
                    //https://api.yaas.io/coupon/v1/{tenant}/coupons/{code}/redemptions
                    CouponREST.Coupon.one('coupons', couponCode).customPOST( couponRequest, 'redemptions').then(function () {
                            deferred.resolve();
                        }, function () {
                            deferred.reject();
                        });
                } else {
                    deferred.reject();
                }
                return deferred.promise;
             },

            /**
             * Retrieves coupon data for customer coupon application request.
             * Returns a promise of the result.
             */
//              redeemCouponCart: function( couponCode, orderId ) {

//                 var deferred = $q.defer();
//                 if (couponCode) {
//                     var couponRequest = this.buildCouponRequest(orderId);
//                     https://api.yaas.io/coupon/v1/{tenant}/coupons/{code}/redemptions
//                     CouponREST.Coupon.one('coupons', couponCode).customPOST( couponRequest, 'redemptions').then(function (resp) {
//                             var response = resp.plain();
//                             debugger;
//                             deferred.resolve();
//                         }, function () {
//                             debugger;
//                             deferred.reject();
//                         });
//                 } else {
//                     debugger;
//                     deferred.reject();
//                 }
//                 return deferred.promise;
//              },


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