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
    /** This controller manages the interactions for the cart icon in the navigation bar, as well as the
     * cart maintenance function of the cart view. The controller is also listening to the 'cart:udpated' event
     * and will refresh the scope's cart instance when the event is received. */
    .controller('CartCtrl', ['$scope', '$rootScope', 'CartSvc', function($scope, $rootScope, CartSvc) {

        $scope.cart = CartSvc.getCart();

        var unbind = $rootScope.$on('cart:updated', function(eve, eveObj){
            $scope.cart = eveObj;
        });

        $scope.$on('$destroy', unbind);

        /** Remove a product from the cart.
         * @param productId
         * */
        $scope.removeProductFromCart = function (productId) {
            CartSvc.removeProductFromCart(productId);
        };

        /** Toggles the "show cart view" property.
         */
        $scope.toggleCart = function (){
            $rootScope.showCart = false;
        };

        /**
         *  Issues an "update cart" call to the service.
         */
         
        $scope.updateCartItem = function (itemId, itemQty) {
            CartSvc.updateCartItem(itemId, itemQty);
        };

    }]);
