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
    /** This controller manages the interactions of the cart view. The controller is listening to the 'cart:udpated' event
     * and will refresh the scope's cart instance when the event is received. */
    .controller('CartCtrl', ['$scope', '$rootScope', 'CartSvc', 'GlobalData', function($scope, $rootScope, CartSvc, GlobalData) {

        $scope.cartAutoTimeoutLength = 3000;
        $scope.cartShouldCloseAfterTimeout = false;
        $scope.cartTimeOut = void 0;
        $scope.cart = CartSvc.getLocalCart();
        $scope.currencySymbol = GlobalData.getCurrencySymbol($scope.cart.currency);

        var unbind = $rootScope.$on('cart:updated', function(eve, eveObj){
            $scope.cart = eveObj.cart;
            $scope.currencySymbol = GlobalData.getCurrencySymbol($scope.cart.currency);
        });

        $scope.createCartTimeout = function()
        {
            //create a timeout object in order to close the cart if it's not hovered
            $scope.cartTimeOut = _.delay(
                function()
                {
                    //update angulars data binding to showCart
                    $scope.$apply($rootScope.showCart = false);
                    $scope.cartShouldCloseAfterTimeout = false;
                },
                $scope.cartAutoTimeoutLength);
        };

        $rootScope.$on('cart:closeAfterTimeout', function(){
            $scope.cartShouldCloseAfterTimeout = true;
            //create a timeout object in order to close the cart if it's not hovered
            $scope.createCartTimeout();
        });

        $scope.$on('$destroy', unbind);

        /** Remove a product from the cart.
         * @param cart item id
         * */
        $scope.removeProductFromCart = function (itemId) {
            CartSvc.removeProductFromCart(itemId);
        };

        /** Toggles the "show cart view" property.
         */
        $scope.toggleCart = function (){
            $rootScope.showCart = false;
        };

        /**
         *  Issues an "update cart" call to the service or removes the item if the quantity is undefined or zero.
         */
         
        $scope.updateCartItem = function (item, itemQty) {
            if (itemQty > 0) {
                CartSvc.updateCartItem(item, itemQty);
            }
            else if (!itemQty || itemQty === 0) {
                CartSvc.removeProductFromCart(item.id);
            }
        };

        $scope.cartHovered = function()
        {
            clearTimeout($scope.cartTimeOut);
        };

        $scope.cartUnHovered = function()
        {
            //if none of the inputs are focused then create the 3 second timer after mouseout
            if( !$('#cart input').is(':focus') )
            {
                $scope.createCartTimeout();
            }

        };

    }]);
