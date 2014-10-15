/**
 * [y] hybris Platform
 *
 * Copyright (c) 2000-2014 hybris AG
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
    .controller('OrderDetailCtrl', ['$scope', 'cart', 'shippingCost', 'GlobalData', 'CartSvc',
        function ($scope, cart, shippingCost, GlobalData, CartSvc) {

            $scope.cart = cart;
            $scope.shippingCost = shippingCost;
            $scope.currencySymbol = GlobalData.getCurrencySymbol();

            var unbindCurrency = $rootScope.$on('currency:updated', function (event, newCurr) {
                CartSvc.switchCurrency(newCurr);
                $scope.currencySymbol = GlobalData.getCurrencySymbol();
            });

            var unbind = $rootScope.$on('cart:updated', function (eve, eveObj) {
                $scope.cart = eveObj;
            });

            $scope.$on('$destroy', unbind, unbindCurrency);

        }]);
