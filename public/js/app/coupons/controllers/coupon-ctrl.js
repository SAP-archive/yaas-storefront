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
    .controller('CouponCtrl', ['$scope', 'AuthSvc', 'AuthDialogManager', 'CouponSvc', 'UserCoupon',
		function( $scope, AuthSvc, AuthDialogManager, CouponSvc, UserCoupon ) {


	      	debugger;

	      	$scope.couponCollapsed = true;
	      	$scope.coupon = UserCoupon.getCoupon();

			$scope.$on('couponUpdated', function(e, userCoupon) {
				debugger;
				$scope.coupon = userCoupon;
			});


			$scope.removeCoupon = function(couponCode) {
				debugger;
				UserCoupon.setBlankCoupon();
			};

			$scope.applyCoupon = function(couponCode) {
				debugger;
				//! checkAuthentication() ? ok : return;
		        if (!AuthSvc.isAuthenticated()) {
		            var dlg = AuthDialogManager.open({windowClass:'mobileLoginModal'}, {}, {}, true);
		            dlg.then(function(){
		                    if (AuthSvc.isAuthenticated()) {
		                    	debugger;
		                    	$scope.applyCoupon(couponCode);
		                    }
		                }
		            );
		            return;
		        }


				//call coupon service to get discount.
                CouponSvc.getDiscount(couponCode).then(function (couponData) {
                	debugger;
					$scope.coupon = UserCoupon.setCoupon(couponData);
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

			};
    }]);


