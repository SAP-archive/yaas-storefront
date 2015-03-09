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

angular.module('ds.coupon', [])
    /**
     *  Coupon Module contoller.
     */
    .controller('CouponCtrl', ['$scope', 'CouponSvc',
		function( $scope, CouponSvc ) {

			$scope.couponErrorMessage = "could not apply coupon."

			$scope.applyCoupon = function(couponCode) {
				console.log('APPLYING COUPON',couponCode);

				//call coupon service to see if it exists.
                CouponSvc.applyCoupon(couponCode).then(function (couponData) {
                	debugger;
                    return couponData;
                }, function (error) {
                    debugger;
                    //Upstream error handling.
                    $scope.coupon.error = true;
                }).finally(function (data) {
                	debugger;
                });

			};
    }]);


