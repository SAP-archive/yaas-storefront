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

angular.module('ds.checkout')
/** Purpose of this controller is to "glue" the data models of cart and shippingCost into the order details view.*/
    .controller('CheckoutBaseCtrl', ['$scope', '$rootScope', 'cart', 'shippingCost', 'GlobalData','$location','CartSvc','$anchorScroll',
        function ($scope, $rootScope, cart, shippingCost, GlobalData, $location, CartSvc,$anchorScroll) {


            var totalPrice = 0;
            $scope.checkoutCartEditVisible = false;

            $scope.showEditCart = function(){
                totalPrice = cart.totalPrice.value;
                $scope.checkoutCartEditVisible = true;
            };
            $scope.hideEditCart = function(){
                $scope.checkoutCartEditVisible = false;
                //If the mobile navigation is shown that means there are steps in checkout process
                //Check if the subtotal value when opened edit cart is the different when closed
                // (there are changes to cart)
                cart = CartSvc.getLocalCart();
                if(!$rootScope.showMobileNav && totalPrice !== cart.totalPrice.value){
                    //Navigate to second step

                    $location.hash('step2');
                    $anchorScroll();
                }
            };

        }]);
