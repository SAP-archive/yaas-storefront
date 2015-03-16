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

            $scope.couponCollapsed = true;
            $scope.coupon = UserCoupon.getCoupon();

            $scope.$on('couponUpdated', function(e, userCoupon) {
                $scope.coupon = userCoupon;
            });


            $scope.applyCoupon = function(couponCode) {
                if(!$scope.checkAuthentication(couponCode)){
                    return;
                }

                //call coupon service to get discount.
                CouponSvc.validateCoupon(couponCode).then(function (couponData) {
                    $scope.coupon = UserCoupon.setCoupon(couponData);
                    $scope.coupon.applied = true;
                    $scope.coupon.valid = true;

                    if ( couponData.discountType === 'ABSOLUTE' ) {
                        $scope.coupon.amounts.discountAmount = couponData.discountAbsolute.amount;
                    }
                    else if ( couponData.discountType === 'PERCENT' ) {
                        $scope.coupon.amounts.discountAmount = ( 0.01 * $scope.coupon.amounts.originalAmount * couponData.discountPercentage.amount);
                    }

                }, function () {
                    //upstream error handling.
                    $scope.coupon.valid = false;
                });

            };

            $scope.removeCoupon = function() {
                UserCoupon.setBlankCoupon();
            };

            $scope.checkAuthentication = function(couponCode){
                if (!AuthSvc.isAuthenticated()) {
                    var dlg = AuthDialogManager.open({windowClass:'mobileLoginModal'}, {}, {}, true);
                    dlg.then(function(){
                            if (AuthSvc.isAuthenticated()) {
                                $scope.applyCoupon(couponCode);
                            }
                        }
                    );
                    return false;
	            }
	            return true;
            };

    }]);


