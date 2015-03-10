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

			// $scope.couponErrorMessage = "could not apply coupon."
			// $scope.couponAppliedMessage = "coupon applied."


   //          $scope.coupon = {
   //              code: '',
   //              applied: false,
   //              valid: true
   //          };

			// $scope.coupon.message = {
			// 	error: "could not apply coupon.",
			// 	success: "coupon applied."
			// }

   //          $scope.coupon.amounts = {
   //              // shippingAmount: 0,
   //              originalAmount: 0,
   //              originalTotalAmount: 0,
   //              redeemDiscount: 0,
   //              couponDiscount: 0,
   //              discountAmount: 0,
   //              newAmount: 0
   //          };


			$scope.blankCoupon = {
	                code: '',
	                applied: false,
	                valid: true,
					message : {
						error: "Code not valid",
						success: "Applied"
					},
					amounts : {
		                // shippingAmount: 0,
		                originalAmount: 0,
		                // originalTotalAmount: 0,
		                // redeemDiscount: 0,
		                // couponDiscount: 0,
		                discountAmount: 0//,
		                // newAmount: 0
		            }
	            };
   			$scope.coupon = angular.copy($scope.blankCoupon);

			$scope.removeCoupon = function(couponCode) {
				debugger;
				$scope.coupon = angular.copy(this.blankCoupon);
			};

			$scope.applyCoupon = function(couponCode) {

				//call coupon service to get discount.
                CouponSvc.getDiscount(couponCode).then(function (couponData) {
                	debugger;
                	$scope.coupon = angular.extend($scope.coupon, couponData);
                	$scope.coupon.applied = true;
                	$scope.coupon.valid = true;

                    if ( couponData.discountType === 'ABSOLUTE' ) {
                        $scope.coupon.amounts.discountAmount = couponData.discountAbsolute.amount;
                    }
                    else if ( couponData.discountType === 'PERCENT' ) {
                    	debugger;
                        $scope.coupon.amounts.discountAmount = ( 0.01 * $scope.coupon.amounts.originalAmount * couponData.discountPercentage.amount);
                    }

                }, function (resp) {
                    debugger;
                    //Upstream error handling.
                    $scope.coupon.valid = false;
                });
                // .finally(function (data) {
                // 	debugger;
                // });

			};
    }]);


