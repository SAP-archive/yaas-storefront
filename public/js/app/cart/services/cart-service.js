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
    .factory('CartSvc', [function(){

        /*
            until the cart API has been implemented, we
            will just save items to the scope.
         */

        var Cart = function(){
           this.subtotal = 0;
           this.estTax = 0;
           this.items = [];
           this.itemCount = 0;
           this.subtotal = 0;
        };

        var cart = new Cart();



        return {

            getCart: function() {
                return cart;
            },

            /*
                Calculates the subtotal, saves it to the cart and also returns the value.

                @return subtotal
             */
            calculateSubtotal: function () {
                var subtotal = 0;

                angular.forEach(cart.items, function(product) {
                    if (product.price && product.quantity) {
                        cart.subtotal = subtotal + (product.price * product.quantity);
                    }
                });

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

                this.updateItemCount();
                this.calculateSubtotal();
            },
            updateItemCount: function () {
                var count = 0, thisCart = this.getCart();
                for (var i = 0; i < thisCart.length; i++) {
                    if (thisCart.items[i].quantity) {
                        count = count + thisCart.items[i].quantity;
                    }
                }
                thisCart.itemCount = count;

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
                this.updateItemCount();
                this.calculateSubtotal();
            },

            emptyCart: function () {
                for (var i = 0; i < cart.items.length; i++) {
                    cart.items[i].quantity = 0;
                }
                this.updateItemCount();
                this.calculateSubtotal();
            }
        };

    }]);
