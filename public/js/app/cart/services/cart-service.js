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

    .factory('CartSvc', ['$rootScope', '$state', '$stateParams', 'CartREST', 'ProductSvc', 'AccountSvc', '$q', 'GlobalData',
        function($rootScope, $state, $stateParams, CartREST, ProductSvc, AccountSvc, $q, GlobalData){

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

        // Prototype for outbound currency switch call
        var Currency = function(code) {
            this.currency = code;
        };

        // application scope cart instance
        var cart = {};


        /**  Ensure there is a cart associated with the current session.
         * Returns a promise for the existing or newly created cart.  Cart will only contain the id.
         * (Will create a new cart if the current cart hasn't been persisted yet).
         */
        function getOrCreateCart() {
            var deferredCart = $q.defer();
            // Use copy of cart from local scope if it exists - don't want to use same instance because we don't want
            //   data binding
            if (cart.id) {
                deferredCart.resolve({ cartId: cart.id});
            } else {

                var newCart = {};
                var accPromise = AccountSvc.getCurrentAccount();
                accPromise.then(function (successAccount) {
                    newCart.customerId = successAccount.id;
                });
                accPromise.finally(function () {
                    newCart.currency = GlobalData.getCurrencyId();
                    CartREST.Cart.all('carts').post(newCart).then(function (response) {
                        cart.id = response.cartId;
                        deferredCart.resolve({ cartId: cart.id});
                    }, function () {
                        deferredCart.reject();
                    });
                });
            }
            return deferredCart.promise;
        }

        /** Creates a new Cart Item.  If the cart hasn't been persisted yet, the
         * cart is created first.
         */
        function createCartItem(product, qty) {

            var createItemDef = $q.defer();
            getOrCreateCart().then(function(cartResult){
            var price = {'value': product.defaultPrice.value, 'currency': product.defaultPrice.currency};
                var item = new Item(product, price, qty);
                CartREST.Cart.one('carts', cartResult.cartId).all('items').post(item).then(function(){
                    refreshCart(cartResult.cartId);
                    createItemDef.resolve();
                }, function(){
                    refreshCart(cart.id);
                    createItemDef.reject();
                });

            }, function(){
                createItemDef.reject();
            });
            return createItemDef.promise;
        }

        /** Retrieves the current cart state from the service, updates the local instance
         * and fires the 'cart:updated' event.*/
        function refreshCart(cartId){
            var defCart = $q.defer();
            CartREST.Cart.one('carts', cartId).get().then(function(response){
                cart = response.plain();
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
                        defCart.resolve(cart);
                    }, function(){
                        defCart.resolve(cart);
                    });
                }  else {
                    defCart.resolve(cart);
                }

            }, function(response){
                cart = {};
                if(!response || response.status!== 404) {
                    cart.error = true;
                }
                defCart.resolve(cart);
            });
            defCart.promise.then(function(){
                $rootScope.$emit('cart:updated', cart);
            });
            return defCart.promise;
        }



        return {

            /** Returns the cart as stored in the local scope.*/
            getLocalCart: function(){
                return cart;
            },

            /** Returns a promise over the cart associated with the current user
             * (unauthenticated only at this time).*/
            getCart: function(){
                return refreshCart(cart.id? cart.id : null);
            },

            /** Persists the cart instance via PUT request (if qty > 0). Then, reloads that cart
             * from the API for consistency and in order to display the updated calculations (line item totals, etc).
             * @return promise to signal success/failure*/
            updateCartItem: function (item, qty) {
                var updateDef = $q.defer();
                if(qty > 0) {
                    var cartItem =  new Item(item.product, item.unitPrice, qty);
                    CartREST.Cart.one('carts', cart.id).all('items').customPUT(cartItem, item.id).then(function(){
                        refreshCart(cart.id);
                        updateDef.resolve();
                    }, function(){
                        angular.forEach(cart.items, function(it){
                            if(item.id === it.id){
                                item.error = true;
                            }
                        });
                        updateDef.reject();
                    });
                }
                return updateDef.promise;
            },

            /**
             * Removes a product from the cart, issues a PUT, and then a GET for the updated information.
             * @param productId
             */
            removeProductFromCart: function (itemId) {
                CartREST.Cart.one('carts', cart.id).one('items', itemId).customDELETE().then(function(){
                    refreshCart(cart.id);
                }, function(){
                    angular.forEach(cart.items, function(item) {
                        if(item.id === itemId) {
                            item.error = true;
                        }
                    });
                });
            },

            /*
             *   Adds a product to the cart, updates the cart (PUT) and then retrieves the updated
             *   cart information (GET).
             *   @param product to add
             *   @param productDetailQty quantity to add
             *   @return promise over success/failure
             */
            addProductToCart: function (product, productDetailQty) {
                if (productDetailQty > 0) {
                    var item = null;
                    for (var i = 0; cart.items && i < cart.items.length; i++) {
                        item = cart.items[i];
                        if (product.id === item.product.id) {
                            var qty = item.quantity + productDetailQty;
                            return this.updateCartItem(item, qty);
                        }
                    }
                    return createCartItem(product, productDetailQty);
                } else {
                    return $q.when({});
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
            },

            /*
             *  This function switches the cart's currency and refreshes the cart
             *  @param currency code to switch to
             */
            switchCurrency: function (code) {
                if (cart.id) {
                    var newCurrency = new Currency(code);
                    CartREST.Cart.one('carts', cart.id).one('changeCurrency').customPOST(newCurrency)
                        .then(function () {
                            refreshCart(cart.id);
                    }, function(){
                            // TODO - need better error notification
                            window.alert('Update of cart currency failed.');
                        });


                }

            }

        };

    }]);
