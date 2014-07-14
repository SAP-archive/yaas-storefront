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

        var unbind = $rootScope.$on('cart:updated', function(eve, eveObj){
            $scope.cart = eveObj;
        });

        $scope.$on('$destroy', unbind);

        $scope.removeProductFromCart = function (productId) {
            CartSvc.removeProductFromCart(productId);
        };

        $scope.toggleCart = function (){
            $rootScope.showCart = false;
        };

        /**
         *
         * @param sku
         * @param qty
         */
        $scope.updateCart = function () {
            CartSvc.updateCart();
        };

    }]);
