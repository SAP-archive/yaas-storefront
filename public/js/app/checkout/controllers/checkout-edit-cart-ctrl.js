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
    .controller('CheckoutEditCartCtrl', ['$scope', '$rootScope', 'CartSvc', 'GlobalData',
        function ($scope, $rootScope, CartSvc, GlobalData) {

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

            $scope.$on('$destroy', unbind);

            /** Remove a product from the cart.
             * @param cart item id
             * */
            $scope.removeProductFromCart = function (itemId) {
                CartSvc.removeProductFromCart(itemId);
            };


            /**
             *  Issues an "update cart" call to the service or removes the item if the quantity is undefined or zero.
             */
            $scope.updateCartItemQty = function (item, itemQty, config) {
                var promise;
                if (itemQty > 0) {
                    promise = CartSvc.updateCartItemQty(item, itemQty, config);
                }
                else if (!itemQty || itemQty === 0) {
                    promise = CartSvc.removeProductFromCart(item.id);
                }
                $scope.updatedCartItems.push(promise);
            };

        }]);
