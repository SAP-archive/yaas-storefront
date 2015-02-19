/**
 * [y] hybris Platform
 *
 * Copyright (c) 2000-2015 hybris AG
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of hybris
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with hybris.
 */

'use strict';

angular.module('ds.cart')

    .factory('CartSvc', ['$rootScope', 'CartREST', 'ProductSvc', 'AccountSvc', '$q', 'GlobalData',
        function ($rootScope, CartREST, ProductSvc, AccountSvc, $q, GlobalData) {

            // Prototype for outbound "update cart item" call
            var Item = function (product, price, qty) {
                this.product = {
                    id: product.id
                };
                this.unitPrice = price;
                this.quantity = qty;
            };

            // Prototype for cart as used in UI
            var Cart = function () {
                this.items = [];
                this.totalUnitsCount = 0;
                this.subTotalPrice = {};
                this.subTotalPrice.value = 0;
                this.totalPrice = {};
                this.totalPrice.value = 0;
                this.id = null;
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

            function getCartWithImages(cart) {
                var updatedCartDef = $q.defer();
                if (cart.items && cart.items.length) {
                    // we need to retrieve images for the items in the cart:
                    var productIds = cart.items.map(function (item) {
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
                                    item.product.name = product.name;
                                }
                            });
                        });
                        updatedCartDef.resolve(cart);
                    }, function () {
                        // proceed without images
                        updatedCartDef.resolve(cart);
                    });
                } else {
                    updatedCartDef.resolve(cart);
                }
                return updatedCartDef.promise;
            }


            /** Retrieves the current cart state from the service, updates the local instance
             * and fires the 'cart:updated' event.*/
            function refreshCart(cartId, updateSource, closeCartAfterTimeout) {
                var defCart = $q.defer();
                var defCartTemp = $q.defer();
                CartREST.Cart.one('carts', cartId).get().then(function (response) {
                    cart = response.plain();
                    if (cart.currency !== GlobalData.getCurrencyId()) {
                        CartREST.Cart.one('carts', cart.id).one('changeCurrency').customPOST({currency: GlobalData.getCurrencyId}).then(function(){
                            CartREST.Cart.one('carts', cartId).get().then(function (response) {
                                cart = response.plain();
                                defCartTemp.resolve(cart);
                            }, function(){
                                defCartTemp.reject();
                            });
                        }, function(){
                           defCartTemp.reject();
                        });

                    } else {
                        defCartTemp.resolve(cart);
                    }
                    defCartTemp.promise.then(function(curCart){
                        getCartWithImages(curCart).then(function(updatedCart){
                            defCart.resolve(updatedCart);
                        });

                    }, function(){
                        cart.error = true;
                    });

                }, function (response) {
                    cart = {};
                    if (!response || response.status !== 404) {
                        cart.error = true;
                    }
                    else {
                        console.warn('Could not find cart. A new cart will be created when the user adds an item.');
                    }
                    defCart.resolve(cart);
                });
                defCart.promise.then(function () {
                    $rootScope.$emit('cart:updated', { cart: cart, source: updateSource, closeAfterTimeout: closeCartAfterTimeout});
                });
                return defCart.promise;
            }

            function switchCurrency(code){
                var def = $q.defer();
                if (cart.id) {
                    CartREST.Cart.one('carts', cart.id).one('changeCurrency').customPOST({currency: code})
                        .then(function () {
                            refreshCart(cart.id, 'currency').finally(function(){
                                def.resolve({});
                            });
                        }, function () {
                            cart.error = true;
                            $rootScope.$emit('cart:updated', {cart: cart, source: 'currency'});
                            def.resolve({});
                            console.error('Update of cart currency failed.');
                        });
                } else {
                    def.resolve();
                }
                return def.promise;
            }

            function mergeAnonymousCartIntoCurrent(anonCart){
                if (anonCart && anonCart.id) {
                    // merge anon cart into user cart
                    CartREST.Cart.one('carts', cart.id).one('merge').customPOST({carts: [anonCart.id]}).then(function () {
                        // merge anonymous cart - will change currency if needed
                        refreshCart(cart.id, 'merge');
                    }, function(){
                        cart.error = true;
                    });
                } else {
                    // scope is already equivalent to latest user cart
                    if (cart.currency !== GlobalData.getCurrencyId()) {
                        switchCurrency(GlobalData.getCurrencyId());
                    } else {
                        $rootScope.$emit('cart:updated', {cart: cart});
                    }
                }
            }

            /** Creates a new Cart Item.  If the cart hasn't been persisted yet, the
             * cart is created first.
             */
            function createCartItem(product, qty, config) {

                var closeCartAfterTimeout = (!_.isUndefined(config.closeCartAfterTimeout)) ? config.closeCartAfterTimeout : undefined;
                var cartUpdateMode = (!config.opencartAfterEdit) ? 'auto' : 'manual';

                var createItemDef = $q.defer();
                getOrCreateCart().then(function (cartResult) {
                    var price = {'value': product.defaultPrice.value, 'currency': product.defaultPrice.currency};
                    var item = new Item(product, price, qty);
                    CartREST.Cart.one('carts', cartResult.cartId).all('items').post(item).then(function () {
                        refreshCart(cartResult.cartId, cartUpdateMode, closeCartAfterTimeout);
                        createItemDef.resolve();
                    }, function () {
                        refreshCart(cart.id, cartUpdateMode, closeCartAfterTimeout);
                        createItemDef.reject();
                    });

                }, function () {
                    createItemDef.reject();
                });
                return createItemDef.promise;
            }



            return {

                /**
                 * Creates a new Cart instance that does not have an ID.
                 * This will prompt the creation of a new cart once items are added to the cart.
                 * Should be invoked once an existing cart has been successfully submitted to checkout.
                 */
                resetCart: function () {
                    cart = new Cart();
                    $rootScope.$emit('cart:updated', {cart: cart, source: 'reset'});
                },

                /** Returns the cart as stored in the local scope - no GET is issued.*/
                getLocalCart: function () {
                    return cart;
                },

                /**
                 * Retrieves the current cart's state from service and returns a promise over that cart.
                 */
                getCart: function () {
                    return refreshCart(cart.id ? cart.id : null);
                },

                /*
                 *  This function switches the cart's currency and refreshes the cart.  Returns an empty success promise
                 *  once the refresh has happened (either successfully or failed).
                 *  @param currency code to switch to
                 */
                switchCurrency: function (code) {
                    return switchCurrency(code);
                },

                /**
                 * Retrieve any existing cart that there might be for an authenticated user, and merges it with
                 * any content in the current cart.
                 */
                refreshCartAfterLogin: function (customerId) {
                    // store existing anonymous cart
                    var anonCart = cart;
               
                    // retrieve any cart associated with the authenticated user
                    CartREST.Cart.one('carts', null).get({customerId: customerId}).then(function (authUserCart) {
                        // there is an existing cart - update scope instance
                        getCartWithImages(authUserCart.plain()).then(function(updatedCart){
                            cart = updatedCart;
                            mergeAnonymousCartIntoCurrent(anonCart);
                        });
                    }, function () {
                        // no existing user cart
                        if (anonCart && anonCart.id) {
                            // create new cart for customer so anon cart can be merged into it
                            cart = {customerId: customerId, currency: GlobalData.getCurrencyId()};

                            CartREST.Cart.all('carts').post(cart).then(function (newCartResponse) {
                                cart.id = newCartResponse.cartId;
                                mergeAnonymousCartIntoCurrent(anonCart);
                            }, function(){
                                cart.error = true;
                                console.error('new cart creation failed');
                            });
                        } else { // anonymous cart was never created
                            // just use empty cart - customer-specific cart will be created once first item is added
                            cart = {};
                            cart.currency = GlobalData.getCurrencyId();
                        }
                    });
                },

                /** Persists the cart instance via PUT request (if qty > 0). Then, reloads that cart
                 * from the API for consistency and in order to display the updated calculations (line item totals, etc).
                 * @return promise to signal success/failure*/
                updateCartItem: function (item, qty, config) {
                    var closeCartAfterTimeout = (!_.isUndefined(config.closeCartAfterTimeout)) ? config.closeCartAfterTimeout : undefined;
                    var cartUpdateMode = (!config.opencartAfterEdit) ? 'auto' : 'manual';
                    var updateDef = $q.defer();
                    if (qty > 0) {
                        var cartItem = new Item(item.product, item.unitPrice, qty);
                        CartREST.Cart.one('carts', cart.id).all('items').customPUT(cartItem, item.id).then(function () {
                            refreshCart(cart.id, cartUpdateMode, closeCartAfterTimeout);
                            updateDef.resolve();
                        }, function () {
                            angular.forEach(cart.items, function (it) {
                                if (item.id === it.id) {
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
                    CartREST.Cart.one('carts', cart.id).one('items', itemId).customDELETE().then(function () {
                        refreshCart(cart.id, 'manual');
                    }, function () {
                        angular.forEach(cart.items, function (item) {
                            if (item.id === itemId) {
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
                 *   @param closeCartAfterTimeout if the
                 *   @return promise over success/failure
                 */
                addProductToCart: function (product, productDetailQty, config) {
                    if (productDetailQty > 0) {
                        var item = null;
                        for (var i = 0; cart.items && i < cart.items.length; i++) {
                            item = cart.items[i];
                            if (product.id === item.product.id) {
                                var qty = item.quantity + productDetailQty;
                                return this.updateCartItem(item, qty, config);
                            }
                        }
                        return createCartItem(product, productDetailQty, config);
                    } else {
                        return $q.when({});
                    }
                }


            };

        }]);
