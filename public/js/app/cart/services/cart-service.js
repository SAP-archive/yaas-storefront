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

    .factory('CartSvc', ['$rootScope', 'CartREST', '$q', function($rootScope, CartREST, $q){

        // Prototype for outbound "update cart" call line items
        var CartItem = function(product, price, qty) {
            this.product = product;
            this.unitPrice = price;
            this.quantity = qty;
        };

        // Prototype for cart as used in UI
        var Cart = function(){
           this.cartItems = [];
           this.totalUnitsCount = 0;
           this.subTotalPrice = {};
           this.subTotalPrice.price = 0;
           this.totalPrice = {};
           this.totalPrice.price = 0;
           this.id = null;
        };

        // application scope cart instance
        var cart = new Cart();


        /**
         * Returns a promise for the existing or newly created cart.
         * (Will create a new cart if the current cart hasn't been persisted yet).
         */
        function getOrCreateCart() {
            var deferredCart = $q.defer();
            var newCart = {};
            if(cart.id){
                newCart.cartId = cart.id;
                deferredCart.resolve(newCart);
            } else {
                // HARD CODED BECAUSE CART SERVICE REQUIRES CUSTOMER ID - is not really implemented yet in cart service
                newCart.customerId = 'FAKE_AND_HARD_CODED';
                CartREST.Cart.all('carts').post(newCart).then(function(response){
                    cart.id = response.cartId;
                    deferredCart.resolve(response);
                }, function(error){
                    console.error(error);
                    deferredCart.reject();
                });
            }
            return deferredCart.promise;
        }

        /** Creates a new Cart Item.  If the cart hasn't been persisted yet, the
         * cart is created first.
         */
        function createCartItem(product, qty) {
            var cartPromise = getOrCreateCart();
            cartPromise.then(function(cartResult){
                var price = {'value': product.defaultPrice.price, 'currency': product.defaultPrice.currencyId};
                var item = new CartItem(product, price, qty);
                CartREST.Cart.one('carts', cartResult.cartId).all('items').post(item).then(function(){
                    refreshCart();
                });
            }, function(error){
                console.error(error);
                // TODO - show notification to user
            });
        }

        /** Retrieves the current cart state from the service, updates the local instance
         * and fires the 'cart:updated' event.*/
        function refreshCart(){
            var newCart = CartREST.CartDetails.one('carts', cart.id).one('details').get();
            newCart.then(function(response){
                cart.subTotalPrice = response.subTotalPrice;
                cart.totalUnitsCount = response.totalUnitsCount;
                cart.totalPrice = response.totalPrice;
                cart.cartItems = response.cartItems;
                $rootScope.$emit('cart:updated', cart);
            });
        }

        function updateCartItem(cartItem){
            CartREST.Cart.one('carts', cart.id).one('items', cartItem.id).put(cartItem).then(function(){
                refreshCart();
            });
        }

        return {

            /** Returns the cart instance from the application scope - does not conduct a GET from the API.*/
            getCart: function() {
                return cart;
            },

            /** Persists the cart instance via PUT request; then reloads that cart
             * from the API for consistency and in order to display the updated calculations (line item totals, etc).*/
            updateCartItem: function (itemId, itemQty) {
                var cartItem =  new CartItem(itemId, itemQty);
                CartREST.Cart.one('carts', cart.id).one('items', itemId).put(cartItem).then(function(){
                    refreshCart();
                });
            },


            /*
             *   Adds a product to the cart, updates the cart (PUT) and then retrieves the updated
             *   cart information (GET).
             *   @param product to add
             *   @param productDetailQty quantity to add
             */
            addProductToCart: function (product, productDetailQty) {
                if (productDetailQty > 0) {
                    for (var i = 0; cart.cartItems && i < cart.cartItems.length; i++) {
                        if (product.id === cart.cartItems[i].productId) {
                            cart.cartItems[i].quantity = cart.cartItems[i].quantity + productDetailQty;
                            updateCartItem(cart.cartItems[i]);
                            return;
                        }
                    }
                    createCartItem(product, productDetailQty);
                }
            },



            /**
             * Removes a product from the cart, issues a PUT, and then a GET for the updated information.
             * @param productId
             */
            removeProductFromCart: function (productId) {
                angular.forEach(cart.cartItems, function (cartItem) {
                   if(cartItem.productId === productId) {
                       cartItem.quantity = 0;
                   }
                });
                this.updateCart();
            },

            /**
             * Creates a new Cart instance that does not have an ID.
             * This will prompt the creation of a new cart once items are added to the cart.
             * Should be invoked once an existing cart has been successfully submitted to checkout.
             */
            resetCart: function () {
               cart = new Cart();
               $rootScope.$emit('cart:updated', cart);
            }

        };

    }]);
