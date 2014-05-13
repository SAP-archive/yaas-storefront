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

        var Cart = function(){
           this.estTax = 0;
           this.items = [];
           this.itemCount = 0;
           this.subtotal = 0;
        };

        var cart = new Cart();

        function updateItemCount() {
            // copying all non-zero items to new array to delete zeroes
            var newItems = [];
            var count = 0;
            for (var i = 0; i < cart.items.length; i++) {
                if (cart.items[i].quantity) {
                    count = count + cart.items[i].quantity;
                    newItems.push(cart.items[i]);
                }
            }
            cart.items = newItems;
            cart.itemCount = count;
        }


        /*
         Calculates the subtotal and saves it to the cart.

         @return subtotal
         */
        function calculateSubtotal() {
            var subtotal = 0;

            angular.forEach(cart.items, function(product) {
                if (product.price && product.quantity) {
                    subtotal = subtotal + (product.price * product.quantity);
                }
            });
            cart.subtotal = subtotal;
        }

        function recalculateCart() {
            updateItemCount();
            calculateSubtotal();
            $rootScope.$emit('cart:updated', cart);
        }

        return {

            getCart: function() {
                return cart;
            },

            updateLineItem: function(sku, qty) {
                for (var i = 0; i < cart.items.length; i++) {
                    if (cart.items[i].sku === sku) {
                       cart.items[i].quantity = qty;
                       break;
                    }
                }
                recalculateCart();
            },

            /*
                converts product object to line item object and pushes it to the cart
             */
            addProductToCart: function (product, productDetailQty) {
                var alreadyInCart = false;
                for (var i = 0; i < cart.items.length; i++) {
                    if (product.sku === cart.items[i].sku) {
                        cart.items[i].quantity = cart.items[i].quantity + productDetailQty;
                        alreadyInCart = true;
                        break;
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

                    cart.items.push(cartProductToPush);
                }
                recalculateCart();
            },

            /*
                removes a product from the cart
             */
            removeProductFromCart: function (sku) {
                angular.forEach(cart.items, function (product) {
                   if(product.sku === sku) {
                       product.quantity = 0;
                   }
                });
                recalculateCart();
            },

            emptyCart: function () {
                for (var i = 0; i < cart.items.length; i++) {
                    cart.items[i].quantity = 0;
                }
                recalculateCart();
            }

        };

    }]);
