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

    // .factory('CartSvc', ['$rootScope', 'CartItemsRest', 'CartDetailsRest', 'CartRest', function($rootScope, CartItemsRest, CartDetailsRest, CartRest){
    .factory('CartSvc', ['$rootScope', 'Restangular', 'settings', function($rootScope, Restangular, settings){

        var CartRest = Restangular.withConfig(function(RestangularConfigurer) {
            RestangularConfigurer.setBaseUrl(settings.apis.cart.baseUrl);
        });
        var CartDetailsRest = Restangular.withConfig(function(RestangularConfigurer) {
            RestangularConfigurer.setBaseUrl(settings.apis.cartDetails.baseUrl);
        });
        var CartItemsRest = Restangular.withConfig(function(RestangularConfigurer) {
            RestangularConfigurer.setBaseUrl(settings.apis.cartItems.baseUrl);
        });

        // Prototype for outbound "upcate cart" call line items
        var CartItem = function(productId, qty, itemId) {
            this.productId = productId;
            this.quantity = qty;
            this.cartItemId = itemId;
        };

        // Prototype for outbound "update cart" call - matches API schema
        var CaasUpdateCart = function() {
            this.cartItems = [];
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

        /** Issues a POST for the cart item, then retrieves the updated cart information from the API.*/
        function createCartItem(item) {

            var newCart = {};
            if(cart.id){
                newCart.cartId = cart.id;
            }

            newCart.cartItem = item;

            CartItemsRest.all('cartItems').post(newCart).then(function(response){
                cart.id = response.cartId;
                refreshCart();
            });
        }


        /** Retrieves the current cart state from the service, updates the local instance
         * and fires the 'cart:updated' event.*/
        function refreshCart(){
            var newCart = CartDetailsRest.one('carts', cart.id).one('details').get();
            newCart.then(function(response){
                cart.subTotalPrice = response.subTotalPrice;
                cart.totalUnitsCount = response.totalUnitsCount;
                cart.totalPrice = response.totalPrice;
                cart.cartItems = response.cartItems;
                $rootScope.$emit('cart:updated', cart);
            });
        }

        return {

            /** Returns the cart instance from the application scope - does not conduct a GET from the API.*/
            getCart: function() {
                return cart;
            },

            /** Persists the cart instance via PUT request; then reloads that cart
             * from the API for consistency and in order to display the updated calculations (line item totals, etc).*/
            updateCart: function () {
                var newCart = new CaasUpdateCart();
                angular.forEach(cart.cartItems, function (item) {
                    newCart.cartItems.push(new CartItem(item.productId, item.quantity, item.cartItemId));
                });

                var cartRest = CartRest.one('carts', cart.id);
                _.extend(cartRest, newCart);
                cartRest.put().then(function () {
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
                var alreadyInCart = false;
                for (var i = 0; cart.cartItems && i < cart.cartItems.length; i++) {
                    if (product.id === cart.cartItems[i].productId) {
                        cart.cartItems[i].quantity = cart.cartItems[i].quantity + productDetailQty;
                        alreadyInCart = true;
                        break;
                    }
                }
                if(alreadyInCart) {
                    this.updateCart();
                }  else if (productDetailQty > 0 ) {
                    createCartItem(new CartItem(product.id, productDetailQty));
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
