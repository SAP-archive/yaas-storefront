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

    .factory('CartSvc', ['$rootScope', 'CartREST', 'ProductSvc', 'AccountSvc', '$q', function($rootScope, CartREST, ProductSvc, AccountSvc, $q){

        // Prototype for outbound "update cart item" call
        var Item = function(product, price, qty) {
            this.product = {
                id: product.id
            };
            this.unitPrice = price;
            this.quantity = qty;
        };

        // Prototype for cart as used in UI
        var Cart = function(){
           this.items = [];
           this.totalUnitsCount = 0;
           this.subTotalPrice = {};
           this.subTotalPrice.value = 0;
           this.totalPrice = {};
           this.totalPrice.value = 0;
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
                // create new random id for an anonymous user
                AccountSvc.getCurrentAccount().then(function(successAccount){

                    newCart.customerId = successAccount.id;
                    newCart.currency = 'USD';
                    CartREST.Cart.all('carts').post(newCart).then(function(response){
                        cart.id = response.cartId;
                        deferredCart.resolve(response);
                    }, function(error){
                        console.error(error);
                        deferredCart.reject();
                    });
                }, function(failAccount){
                    deferredCart.reject('Unable to retrieve account details: '+failAccount);
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
                var price = {'value': product.price.value, 'currency': product.price.currency};
                var item = new Item(product, price, qty);
                CartREST.Cart.one('carts', cartResult.cartId).all('items').post(item).then(function(){

                    refreshCart();
                });
            }, function(error){
                console.error(error);
                refreshCart();
                // TODO - show notification to user
            });
        }

        /** Retrieves the current cart state from the service, updates the local instance
         * and fires the 'cart:updated' event.*/
        function refreshCart(){
            var newCart = CartREST.Cart.one('carts', cart.id).get();
            newCart.then(function(response){

                cart = response;
                if(response.items && response.items.length) {
                    // we need to retrieve images for the items in the cart:
                    var productIds = response.items.map(function (item) {
                        return item.product.id;
                    });
                    var productParms = {
                        q: 'id:(' + productIds + ')'
                    };
                    ProductSvc.query(productParms).then(function (productResults) {
                        angular.forEach(cart.items, function (item) {
                            angular.forEach(productResults, function (product) {
                                if (product.id === item.product.id) {
                                    item.images = product.images;
                                }
                            });
                        });
                    });
                }
                $rootScope.$emit('cart:updated', cart);
            });
        }

        return {

            /** Returns the cart instance from the application scope - does not conduct a GET from the API.*/
            getCart: function() {
                return cart;
            },

            /** Persists the cart instance via PUT request (if qty > 0). Then, reloads that cart
             * from the API for consistency and in order to display the updated calculations (line item totals, etc).*/
            updateCartItem: function (item, qty) {
                if(qty > 0) {
                    var cartItem =  new Item(item.product, item.unitPrice, qty);
                    CartREST.Cart.one('carts', cart.id).all('items').customPUT(cartItem, item.id).then(function(){
                        refreshCart();
                    }, function(error){
                        // TODO - should handle in controller - in UI
                        console.error(error);
                        refreshCart();
                    });
                }
            },



            /**
             * Removes a product from the cart, issues a PUT, and then a GET for the updated information.
             * @param productId
             */
            removeProductFromCart: function (itemId) {
                CartREST.Cart.one('carts', cart.id).one('items', itemId).customDELETE().then(function(){
                    refreshCart();
                }, function(error){
                    console.error(error);
                    // error handling should be moved to controller
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
                    var item = null;
                    for (var i = 0; cart.items && i < cart.items.length; i++) {
                        item = cart.items[i];
                        if (product.id === item.product.id) {
                            var qty = item.quantity + productDetailQty;
                            this.updateCartItem(item, qty);
                            return;
                        }
                    }
                    createCartItem(product, productDetailQty);
                }
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
