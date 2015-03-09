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
    .factory('CouponSvc', ['$q', '$http', 'SiteConfigSvc', 'CouponREST',
        function($q, $http, siteConfig, CouponREST){


        return {

            /**
             * Make sure that the coupon code entered by the client can be actually used for the order.
             * Returns a promise of the service result for upstream error handling.
             */
             applyCoupon: function( couponCode ) {
debugger;
                var deferred = $q.defer();
                if (couponCode) {
                    //https://api.yaas.io/coupon/v1/bsdtestproject/coupons/QWERT/validation
                    //https://api.yaas.io/coupon/v1/{tenant}/coupons/{code}/validation
                    CouponREST.Coupon.one('coupons', couponCode).customPOST({}, "validation").then(function () {
                            debugger;
                            deferred.resolve();
                        }, function (resp) {
                            debugger;
                            deferred.reject(resp);
                        });
                } else {
                    debugger;
                    deferred.reject();
                }
                return deferred.promise;
             },

            /**
             * Retrieves coupon data for customer coupon application request.
             * Returns a promise of the result.
             */
             redeemCoupon: function( couponCode ) {
debugger;
                var deferred = $q.defer();
                if (couponCode) {
                    //https://{domain}/coupon/v1/{tenant}/coupons/{code}/redemptions
                    CouponREST.Coupon.one('coupons', couponCode).customGET('redemptions').then(function () {
                            debugger;
                            deferred.resolve();
                        }, function () {
                            debugger;
                            deferred.reject();
                        });
                } else {
                    debugger;
                    deferred.reject();
                }
                return deferred.promise;
             }

        };

    }]);