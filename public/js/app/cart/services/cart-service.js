/**
 * [y] hybris Platform
 *
 * Copyright (c) 2000-2016 hybris AG
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of hybris
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with hybris.
 */

'use strict';

angular.module('ds.cart')

    .factory('CartSvc', ['$rootScope', 'CartREST','ProductSvc', 'AccountSvc', '$q', 'GlobalData', '$location',
        function ($rootScope, CartREST, ProductSvc, AccountSvc, $q, GlobalData) {

            // Prototype for outbound "update cart item" call
            var Item = function (product, price, qty) {

                this.itemYrn = product.itemYrn;

                var currentSiteCode = GlobalData.getSiteCode();

                if (product.mixins && product.mixins.taxCodes && product.mixins.taxCodes[currentSiteCode]) {
                    this.taxCode = product.mixins.taxCodes[currentSiteCode];
                }
                this.price = price;
                this.quantity = qty;
            };

            // Prototype for cart as used in UI
            var Cart = function () {
                this.items = [];
                this.totalUnitsCount = 0;
                this.subTotalPrice = {};
                this.subTotalPrice.amount = 0;
                this.totalPrice = {};
                this.totalPrice.amount = 0;
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
                    deferredCart.resolve({ cartId: cart.id });
                } else {

                    var newCart = {};
                    var accPromise = AccountSvc.getCurrentAccount();
                    accPromise.then(function (successAccount) {
                        newCart.customerId = successAccount.id;
                    });
                    accPromise.finally(function () {
                        newCart.currency = GlobalData.getCurrencyId();
                        newCart.siteCode = GlobalData.getSiteCode();
                        newCart.channel = GlobalData.getChannel();

                        CartREST.Cart.all('carts').post(newCart).then(function (response) {
                            cart.id = response.cartId;
                            deferredCart.resolve({ cartId: cart.id });

                        }, function () {
                            deferredCart.reject();
                        });
                    });
                }
                return deferredCart.promise;
            }


            /** Retrieves the current cart state from the service, updates the local instance
             * and fires the 'cart:updated' event.*/
            function refreshCart(cartId, updateSource, closeCartAfterTimeout) {
                var defCart = $q.defer();
                var defCartTemp = $q.defer();

                var params = { siteCode: GlobalData.getSiteCode() };

                CartREST.Cart.one('carts', cartId).get(params).then(function (response) {
                    cart = response.plain();
                    if (cart.siteCode !== GlobalData.getSiteCode()) {
                        CartREST.Cart.one('carts', cart.id).one('changeSite').customPOST({ siteCode: GlobalData.getSiteCode() }).finally(function () {
                            if (!!GlobalData.customerAccount) {

                                params = angular.extend(params, { customerId: GlobalData.customerAccount.customerNumber });

                                CartREST.Cart.one('carts', cartId).get(params).then(function (response) {
                                    cart = response.plain();
                                    defCartTemp.resolve(cart);
                                }, function () {
                                    defCartTemp.reject();
                                });
                            }
                            else {
                                CartREST.Cart.one('carts', cartId).get(params).then(function (response) {
                                    cart = response.plain();
                                    defCartTemp.resolve(cart);
                                }, function () {
                                    defCartTemp.reject();
                                });
                            }
                        });

                    } else {
                        defCartTemp.resolve(cart);
                    }
                    defCartTemp.promise.then(function (curCart) {
                        defCart.resolve(curCart);

                    }, function () {
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

                    var items =  (cart.items ? cart.items : []);

                    if(!_.isEmpty(items)){
                      var productList = getProductIdsFromCart(items);

                      ProductSvc.queryProductList({q:'id:('+productList+')'}).then(function(res){
                        var products = res.plain();
                        _.forEach(items, function(item){
                          if(item.itemYrn){

                            var split = item.itemYrn.split(';');

                            var prod = _.find(products, {id:split[1]});

                            item.product = {
                              id:prod.id,
                              name:prod.name,
                              images:prod.media,
                              sku:prod.code
                            };

                            if(_.contains(item.itemYrn, 'product-variant')){
                              ProductSvc.getProductVariant({productId:split[1],variantId:split[2]}).then(function(variant){

                                item.variants=[];
                                _.forEach(variant.options, function(ele){
                                  for (var key in ele) {
                                    item.variants.push(key+': '+ ele[key] );
                                  }
                                });

                                if(_.isArray(variant.media) && _.size(variant.media) > 0){
                                    item.product.images = variant.media;
                                    item.product.code = variant.code;
                                }
                                if(variant.name) {
                                  item.product.name = variant.name;
                                }
                              });
                            }
                          }
                        });
                      });
                    }

                    $rootScope.$emit('cart:updated', { cart: cart, source: updateSource, closeAfterTimeout: closeCartAfterTimeout });
                });
                return defCart.promise;
            }

            function mergeAnonymousCartIntoCurrent(anonCart) {
                var deferred = $q.defer();
                if (anonCart && anonCart.id) {
                    // merge anon cart into user cart
                    CartREST.Cart.one('carts', cart.id).one('merge').customPOST({ carts: [anonCart.id] }).then(function () {
                        // merge anonymous cart - will change currency if needed
                        refreshCart(cart.id, 'merge').then(
                            function () {
                                deferred.resolve();
                            },
                            function () {
                                deferred.reject();
                            }
                        );
                    }, function () {
                        cart.error = true;
                        deferred.reject();
                    });
                } else {
                    // scope is already equivalent to latest user cart
                    if (cart.siteCode !== GlobalData.getSiteCode()) {
                        if (cart.id) {
                            refreshCart(cart.id, 'site').then(
                                function () {
                                    deferred.resolve();
                                },
                                function () {
                                    deferred.reject();
                                }
                            );
                        }
                    } else {
                        $rootScope.$emit('cart:updated', { cart: cart });
                        deferred.resolve();
                    }
                }
                return deferred.promise;
            }

            /** Creates a new Cart Item.  If the cart hasn't been persisted yet, the
             * cart is created first.
             */
            function createCartItem(product, prices, qty, config) {
                //product.yrn
                var closeCartAfterTimeout = (!_.isUndefined(config.closeCartAfterTimeout)) ? config.closeCartAfterTimeout : undefined;
                var cartUpdateMode = (!config.opencartAfterEdit) ? 'auto' : 'manual';

                var createItemDef = $q.defer();
                getOrCreateCart().then(function (cartResult) {

                    var price = {'priceId': prices[0].priceId, 'effectiveAmount': prices[0].effectiveAmount, 'originalAmount': prices[0].originalAmount, 'currency': prices[0].currency};

                    if(prices[0].measurementUnit) {
                        price.measurementUnit =  {'unit' : prices[0].measurementUnit.unitCode, 'quantity' : prices[0].measurementUnit.quantity};
                    }
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


            function getProductInCart(cart, product){
                return _.find((cart.items ? cart.items : []),function(item){
                  if(item.itemYrn === product.itemYrn){
                    return item;
                  }
                });
            }

            function getIdFromItemYrn(itemYrn){
              if(_.contains(itemYrn, 'product:product')){
                return itemYrn.split(';')[1];
              } else if(_.contains(itemYrn, 'product:product-variant')){
                return itemYrn.split(';')[2];
              }
            }

            function getProductIdsFromCart(items){
              return _.map(items, function(item){
                return item.itemYrn ? getIdFromItemYrn(item.itemYrn) : '';
              }).join(',');
            }

            function reformatCartItems(cart) {
                var items = [];
                for (var i = 0; i < cart.items.length; i++) {
                    var item = {
                        itemId: cart.items[i].id,
                        itemYrn: cart.items[i].itemYrn,
                        productId: cart.items[i].product ? cart.items[i].product.id : '',
                        quantity: cart.items[i].quantity,
                        unitPrice:{
                            amount: cart.items[i].price.effectiveAmount,
                            currency: cart.items[i].price.currency
                        },
                        taxCode:cart.items[i].taxCode
                    };
                    items.push(item);
                }
                return items;
            }

            /*
             TODO:
             this function is only necessary because the cart mashup does not directly consume the coupon as
             it is returned from the coupon service.  That may change in the future
             */
            function parseCoupon(coupon) {
                if (coupon.discountType === 'ABSOLUTE') {
                    coupon.amount = coupon.discountAbsolute.amount;
                    coupon.currency = coupon.discountAbsolute.currency;
                }
                else if (coupon.discountType === 'PERCENT') {
                    coupon.discountRate = coupon.discountPercentage;
                    coupon.currency = GlobalData.getCurrencyId();
                }

                return coupon;
            }

            return {

                /**
                 * Creates a new Cart instance that does not have an ID.
                 * This will prompt the creation of a new cart once items are added to the cart.
                 * Should be invoked once an existing cart has been successfully submitted to checkout.
                 */
                resetCart: function () {
                    cart = new Cart();
                    $rootScope.$emit('cart:updated', { cart: cart, source: 'reset' });
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

                /**
                 * Retrieve any existing cart that there might be for an authenticated user, and merges it with
                 * any content in the current cart.
                 */
                refreshCartAfterLogin: function (customerId) {
                    var deferred = $q.defer();
                    // store existing anonymous cart
                    var anonCart = cart;

                    // retrieve any cart associated with the authenticated user
                    CartREST.Cart.one('carts', null).get({ customerId: customerId, siteCode: GlobalData.getSiteCode() }).then(function (authUserCart) {
                        // there is an existing cart - update scope instance
                        cart = authUserCart.plain();
                        mergeAnonymousCartIntoCurrent(anonCart).then(
                            function () {
                                deferred.resolve();
                            },
                            function () {
                                deferred.reject();
                            }
                        );
                    }, function () {
                        // no existing user cart
                        if (anonCart && anonCart.id) {
                            // create new cart for customer so anon cart can be merged into it
                            cart = {
                                customerId: customerId,
                                currency: GlobalData.getCurrencyId(),
                                siteCode: GlobalData.getSiteCode(),
                                channel: GlobalData.getChannel()
                            };

                            CartREST.Cart.all('carts').post(cart).then(function (newCartResponse) {
                                cart.id = newCartResponse.cartId;
                                mergeAnonymousCartIntoCurrent(anonCart).then(
                                    function () {
                                        deferred.resolve();
                                    },
                                    function () {
                                        deferred.reject();
                                    }
                                );
                            }, function () {
                                cart.error = true;
                                console.error('new cart creation failed');
                                deferred.reject();
                            });
                        } else { // anonymous cart was never created
                            // just use empty cart - customer-specific cart will be created once first item is added
                            cart = {};
                            cart.currency = GlobalData.getCurrencyId();
                            cart.siteCode = GlobalData.getSiteCode();
                            deferred.resolve();
                        }
                    });
                    return deferred.promise;
                },

                // Exposed for use in mixin services, like cart-note-mixin-service.js
                refreshCart: refreshCart,

                /** Persists the cart instance via PUT request (if qty > 0). Then, reloads that cart
                 * from the API for consistency and in order to display the updated calculations (line item totals, etc).
                 * @return promise to signal success/failure*/
                updateCartItemQty: function (item, qty, config) {
                    var closeCartAfterTimeout = (!_.isUndefined(config.closeCartAfterTimeout)) ? config.closeCartAfterTimeout : undefined;
                    var cartUpdateMode = (!config.opencartAfterEdit) ? 'auto' : 'manual';
                    var updateDef = $q.defer();
                    if (qty > 0) {
                        //this is a partial update, so only quantity data is needed
                        var cartItem = {
                            quantity: qty
                        };
                        CartREST.Cart.one('carts', cart.id).all('items').customPUT(cartItem, item.id + '?partial=true').then(function () {
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
                addProductToCart: function (product, prices, productDetailQty, config) {

                    if (productDetailQty > 0) {

                         var self = this;
                         var productId = _.has(product, 'itemYrn') ? product.itemYrn.split(';')[1] : product.id;

                         return ProductSvc.getProduct({productId:productId}).then(function(response) {
                             if(!_.has(product, 'itemYrn')){
                               product.itemYrn = response.yrn;
                             }

                             product.mixins = response.mixins;
                             var item = getProductInCart(cart, product);
                             if(item){
                               return self.updateCartItemQty(item, item.quantity + productDetailQty, config);
                             }
                             return createCartItem(product, prices, productDetailQty, config);
                         });

                    } else {
                        return $q.when({});
                    }
                },

                redeemCoupon: function (coupon, cartId) {
                    coupon = parseCoupon(coupon);
                    return CartREST.Cart.one('carts', cartId).customPOST(coupon, 'discounts').then(function() {
                        refreshCart(cartId, 'manual');
                    });
                },

                removeAllCoupons: function (cartId) {
                    return CartREST.Cart.one('carts', cartId).all('discounts').remove().then(function () {
                        refreshCart(cartId, 'manual');
                    });
                },

                removeCoupon: function (cartId, couponId) {
                    return CartREST.Cart.one('carts', cartId).one('discounts', couponId).remove().then(function () {
                        refreshCart(cartId, 'manual');
                    });
                },

                getCalculateTax: function () {
                    if (!!cart && !!cart.countryCode && !!cart.zipCode) {
                        return {
                            countryCode: cart.countryCode,
                            zipCode: cart.zipCode,
                            taxCalculationApplied: true
                        };
                    }
                    return { taxCalculationApplied: false };
                },

                setCalculateTax: function (zipCode, countryCode, cartId) {
                    return CartREST.Cart.one('carts', cartId).customPUT({ zipCode: zipCode, countryCode: countryCode }, '').then(function () {
                        refreshCart(cartId, 'manual');
                    });
                },

                recalculateCart: function (cart, addressToShip, shippingCostObject) {
                    var items = reformatCartItems(cart);
                    var discounts = [];
                    angular.forEach(cart.discounts, function(discount){
                        discounts.push({
                            discountRate: discount.discountRate,
                            amount: discount.amount,
                            currency: discount.currency,
                            calculationType: discount.calculationType
                        });
                    });
                    var data = {
                        cartId: cart.id,
                        siteCode: GlobalData.getSiteCode(),
                        currency: GlobalData.getCurrency(),
                        items: items,
                        discounts: discounts,
                        addresses: [
                            {
                              type: 'SHIP_TO',
                              addressLine1: addressToShip.address1,
                              city: addressToShip.city,
                              state: addressToShip.state,
                              zipCode: addressToShip.zipCode,
                              country: addressToShip.country
                            }
                        ]
                    };
                    if (shippingCostObject) {
                        data.shipping = {
                            calculationType: 'QUOTATION',
                            methodId: shippingCostObject.id,
                            zoneId: shippingCostObject.zoneId
                        };
                    }
                    return CartREST.CalculateCart.all('calculation').customPOST(data, '');
                }

            };

        }]);
