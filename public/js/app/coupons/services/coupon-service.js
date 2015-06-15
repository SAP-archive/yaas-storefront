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
    .factory('CouponSvc', ['$q', 'SiteConfigSvc', 'CouponREST', 'CartREST', 'GlobalData', 'appConfig',
        function($q, siteConfig, CouponREST, CartREST, GlobalData, appConfig){

        return {
            /**
             * Gets a coupon object as a response to user coupon entry code.
             */
            getCoupon: function( couponCode ) {
                var deferred = $q.defer();
                if (couponCode) {
                    // get coupon from code
                    CouponREST.Coupon.one('coupons', couponCode).get().then(function ( resp ) {
                            var couponData = resp.plain();
                            if(resp.status === 'VALID'){
                                deferred.resolve(couponData);
                            } else {
                                deferred.reject(resp);
                            }
                        }, function (resp) {
                            deferred.reject(resp);
                        });
                } else {
                    deferred.reject();
                }
                return deferred.promise;
            },


             /**
             * Gets a coupon object from entry code and validates it.
             */
            getValidateCoupon: function( couponCode, totalPrice ) {
                var self = this;
                var deferred = $q.defer();
                if (couponCode) {
                    // get coupon from code
                    CouponREST.Coupon.one('coupons', couponCode).get().then(function (resp) {
                            var couponData = resp.plain();
                            var discountAmount = (couponData.discountType === 'ABSOLUTE') ? couponData.discountAbsolute.amount : parseFloat(couponData.discountPercentage) * 0.01 * parseFloat(totalPrice);
                            var couponRequest = self.buildCouponRequest(couponCode, GlobalData.getCurrencyId(), totalPrice, discountAmount);

                            //Remove on successful service validation of currency mismatch.
                            if(!self.validateCurrency(couponData)){
                                resp.status = 'CURR';
                                deferred.reject(resp);
                                return deferred.promise;
                            }
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
             * validates or invalidates coupon by coupon code and cart total price validation
             */
            validateCoupon: function( couponCode, totalPrice, couponData ) {
                var self = this;
                var deferred = $q.defer();
                if (couponCode) {
                    // get coupon from code
                    var discountAmount = (couponData.discountType === 'ABSOLUTE') ? couponData.discountAbsolute.amount : couponData.discountPercentage * 0.01 * totalPrice;
                    var couponRequest = self.buildCouponRequest(couponCode, GlobalData.getCurrencyId(), totalPrice, discountAmount);
                    // validate coupon
                    CouponREST.Coupon.one('coupons', couponCode).customPOST(couponRequest, 'validation').then(function () {
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

            validateCurrency: function(couponData){
                //Remove on successful service validation of currency mismatch.
                if (angular.isDefined(couponData.restrictions) && angular.isDefined(couponData.restrictions.minOrderValue) && angular.isDefined(couponData.restrictions.minOrderValue.currency) && couponData.restrictions.minOrderValue.currency === GlobalData.getCurrencyId()) {
                    return true;
                } else if ( couponData.discountType === 'ABSOLUTE' && couponData.discountAbsolute.currency === GlobalData.getCurrencyId()){
                    return true;
                } else if ( couponData.discountType === 'PERCENT'){
                    return true;
                }
                return false;
            },

            buildCouponCartRequest: function( couponObj, couponId, currencyType ){
                var apiPath = appConfig.dynamicDomain();
                return {
                            'id': couponId,
                            'amount': couponObj.amounts.discountAmount,
                            'code': couponObj.code,
                            'currency': currencyType,
                            'name': couponObj.name,
                            'calculationType': 'ApplyDiscountBeforeTax',
                            'links': [
                                {
                                  'rel': 'validate',
                                  'href': 'https://' + apiPath + '/hybris/coupon/b1/' + GlobalData.store.tenant + '/coupons/' + couponObj.code + '/validation',
                                  'type': 'application/json',
                                  'title': 'Discounts Validate'
                                },
                                {
                                  'rel': 'redeem',
                                  'href': 'https://' + apiPath + '/hybris/coupon/b1/' + GlobalData.store.tenant + '/coupons/' + couponObj.code + '/redemptions',
                                  'type': 'application/json',
                                  'title': 'Discounts Redeem'
                                }
                            ],
                            'sequenceId': 1, //increment for multiple coupons.
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