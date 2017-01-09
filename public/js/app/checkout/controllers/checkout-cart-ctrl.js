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
    .controller('CheckoutCartCtrl', ['$scope', '$rootScope', 'cart', 'GlobalData', 'CartSvc', 'FeeSvc',
        function ($scope, $rootScope, cart, GlobalData, CartSvc, FeeSvc) {

            if(cart.items && Array.isArray(cart.items)) {
                // This array will hold the list of productYrns of the current cart
                var cartItemsYrn = [];
                cart.items.forEach(function(item) {
                    cartItemsYrn.push(item.itemYrn);
                });
                // Get the fees for the list of productYrns
                FeeSvc.getFeesForItemYrnList(cartItemsYrn).then(function(feesForProductsMap) {
                    $scope.feesInformationForProductsYrnMap = feesForProductsMap;
                });
            }

            $scope.currencySymbol = GlobalData.getCurrencySymbol(cart.currency);
            $scope.taxType = GlobalData.getTaxType();
            $scope.taxConfiguration = GlobalData.getCurrentTaxConfiguration();
            $scope.calculateTax = CartSvc.getCalculateTax();

            var unbind = $rootScope.$on('cart:updated', function (eve, eveObj) {
                $scope.cart = eveObj.cart;
                $scope.currencySymbol = GlobalData.getCurrencySymbol($scope.cart.currency);
                $scope.taxType = GlobalData.getTaxType();
                $scope.taxConfiguration = GlobalData.getCurrentTaxConfiguration();
                $scope.calculateTax = CartSvc.getCalculateTax();
            });

            $rootScope.$on('order:previewed', function (){
                $scope.calculateTax.taxCalculationApplied = true;
            });

            $scope.$on('$destroy', unbind);

        }]);
