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
    .controller('CheckoutCtrl', [ '$scope', 'CartSvc', 'OrderSvc', function ($scope, CartSvc, OrderSvc) {

        $scope.cart = CartSvc.getCart();
        $scope.order = {
            shipToAddress: {},
            billingAddress: {}
        };


        $scope.placeOrder = function (order) {
              OrderSvc.create(order);
        }

    }]);
