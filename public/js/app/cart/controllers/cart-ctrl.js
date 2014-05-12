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


        $scope.qtyInputBlurred = function () {
            if (!this.product.quantity || this.product.quantity === 0) {
                CartSvc.removeProductFromCart(this.product.sku);
            }
        };

        $scope.removeProductFromCart = function (sku) {
            CartSvc.removeProductFromCart(sku);
        };

        $scope.toggleCart = function (){
            $rootScope.showCart = false;
        };

        $scope.updateCart = function (sku, qty) {
            CartSvc.updateLineItem(sku, qty);
        };

    }]);
