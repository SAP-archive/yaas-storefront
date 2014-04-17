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
    .factory('CartSvc', ['$rootScope', function($rootScope){

        /*
            until the cart API has been implemented, we
            will just save items to the scope.
         */

        $rootScope.subtotal = 0;

        $rootScope.estTax = 0;

        $rootScope.cart = [];

        $rootScope.cartLength = 0;

        return {
            calculateSubtotal: function () {
                var subtotal = 0;

                angular.forEach($rootScope.cart, function(product) {
                    subtotal = subtotal + (product.price * product.quantity);
                });

                $rootScope.subtotal = subtotal;
                return subtotal;
            },
            getCart: function () {
                return $rootScope.cart;
            },
            getTax: function () {
                $rootScope.estTax = 0;
                return 0;
            },
            pushProductToCart: function (product, productDetailQty) {
                var alreadyInCart = false;
                for (var i = 0; i < $rootScope.cart.length; i++) {
                    if (product.sku === $rootScope.cart[i].sku) {
                        $rootScope.cart[i].quantity++;
                        $rootScope.cartLength = $rootScope.cartLength + productDetailQty;
                        alreadyInCart = true;
                    }
                }
                if (productDetailQty > 0 && !alreadyInCart) {
                    var cartProductToPush = {};
                    cartProductToPush.sku = product.sku;
                    cartProductToPush.name = product.name;
                    cartProductToPush.quantity = productDetailQty;
                    cartProductToPush.price = product.price;
                    if (product.images) {
                        cartProductToPush.imageUrl = product.images[0].url || '';
                    }

                    $rootScope.cart.push(cartProductToPush);

                    $rootScope.cartLength = $rootScope.cartLength + productDetailQty;
                }
            },
            removeProductFromCart: function (sku) {
                angular.forEach($rootScope.cart, function (product, key) {
                   if(product.sku === sku) {
                       $rootScope.cartLength = $rootScope.cartLength - product.quantity;
                       $rootScope.cart.splice(key, 1);
                   }
                });
                this.calculateSubtotal();
            }
        };

    }]);
