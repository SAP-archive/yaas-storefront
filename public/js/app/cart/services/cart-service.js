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


        // Matches CAAS schema
        var CartItem = function(productId, qty, itemId) {
            this.productId = productId;
            this.quantity = qty;
            this.cartItemId = itemId;
        };

        // Matches CAAS schema
        var CaasUpdateCart = function() {
            this.cartItems = [];
        };

        var Cart = function(){
           this.estTax = 0;
           this.cartItems = [];
           this.totalUnitsCount = 0;
           this.subTotalPrice = {};
           this.subTotalPrice.price = 0;
           this.totalPrice = {};
           this.totalPrice.price = 0;
           this.id = null;
        };

        var cart = new Cart();

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

            getCart: function() {
                return cart;
            },

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
                converts product object to line item object and pushes it to the cart
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



            /*
                removes a product from the cart
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
             */
            resetCart: function () {
               cart = new Cart();
               $rootScope.$emit('cart:updated', cart);
            }

        };

    }]);
