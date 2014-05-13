/*
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

angular.module('ds.cart')
    .controller('CartCtrl', ['$scope', '$rootScope', 'CartSvc', function($scope, $rootScope, CartSvc) {

        $scope.cart = CartSvc.getCart();


        $scope.removeProductFromCart = function (sku) {
            CartSvc.removeProductFromCart(sku);
        };

        $scope.toggleCart = function (){
            $rootScope.showCart = false;
        };


        /**
         *
         * @param sku
         * @param qty
         * @param keepZeroInCart if true, line items with qty of zero or undefined will remain in the cart; else,
         *         they will be removed
         */
        $scope.updateCart = function (sku, qty, keepZeroInCart) {
            CartSvc.updateLineItem(sku, qty, keepZeroInCart);
        };

    }]);
