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

angular.module('ds.coupon')
    /**
     *  Coupon Module contoller.
     */
    .controller('CouponCtrl', ['$scope', '$rootScope', 'AuthSvc', 'AuthDialogManager', 'CouponSvc', 'UserCoupon',
        function( $scope, $rootScope, AuthSvc, AuthDialogManager, CouponSvc, UserCoupon ) {

            $scope.couponCollapsed = true;
            $scope.coupon = UserCoupon.getCoupon();

            /** load new coupon into view */
            var couponupdate = $scope.$on('coupon:updated', function(e, userCoupon) {
                $scope.coupon = userCoupon;
            });
            $scope.$on('$destroy', couponupdate);

            /** revalidate coupon on cart change */
            var couponcartupdate = $rootScope.$on('coupon:cartupdate', function(){
                $scope.applyCoupon($scope.coupon.code);
            });
            $scope.$on('$destroy', couponcartupdate);

            /** apply user coupon into cart */
            $scope.applyCoupon = function(couponCode) {

                var totalPrice = $scope.cart.totalPrice.value;
                if(!checkAuthentication(couponCode)){
                    return;
                }

                //call coupon service to get discount.
                CouponSvc.getCoupon(couponCode).then(function (couponData) {
                    $scope.coupon = UserCoupon.setCoupon(couponData);
                    $scope.coupon.applied = true;
                    $scope.coupon.valid = true;

                    if ( couponData.discountType === 'ABSOLUTE' ) {
                        // set discount to subtotal if it is greater than subtotal
                        if (couponData.discountAbsolute.amount > $scope.cart.subTotalPrice.value){
                            $scope.coupon.amounts.discountAmount = $scope.cart.subTotalPrice.value;
                        } else {
                            $scope.coupon.amounts.discountAmount = couponData.discountAbsolute.amount;
                        }
                    }
                    else if ( couponData.discountType === 'PERCENT' ) {
                        // must round percentage here in order to match service api discount comparison validation.
                        $scope.coupon.amounts.discountAmount = parseFloat( 0.01 * couponData.discountPercentage * $scope.cart.subTotalPrice.value).toFixed(2);
                    }
                }, function (e) {  //upstream error handler.
                    $scope.coupon.valid = false;
                    $scope.coupon.message.error = e.status; //show api error.
                });
            };

            $scope.removeCoupon = function() {
                UserCoupon.setBlankCoupon();
            };

            function checkAuthentication(couponCode){
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
            }


    }]);


