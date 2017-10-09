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

    .factory('CartSvc', ['$rootScope', 'CartREST', 'ProductSvc', 'AccountSvc', '$q', 'GlobalData', '$location',
        function ($rootScope, CartREST, ProductSvc, AccountSvc, $q, GlobalData) {

            // Prototype for outbound "update cart item" call
            var Item = function (product, price, qty) {

                this.itemYrn = product.itemYrn;

                var currentSiteCode = GlobalData.getSiteCode();

                if (product.mixins && product.mixins.taxCodes && product.mixins.taxCodes[currentSiteCode]) {
                    this.taxCode = product.mixins.taxCodes[currentSiteCode];
                }
                this.product = product;
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
            var cart = new Cart();
            cart.id = new Date().getMilliseconds();

            /**  Ensure there is a cart associated with the current session.
             * Returns a promise for the existing or newly created cart.  Cart will only contain the id.
             * (Will create a new cart if the current cart hasn't been persisted yet).
             */
            function getOrCreateCart() {
                return $q.resolve(cart);
            }


            /** Retrieves the current cart state from the service, updates the local instance
             * and fires the 'cart:updated' event.*/
            function refreshCart(cartId, updateSource, closeCartAfterTimeout) {
                $rootScope.$emit('cart:updated', {
                    cart: cart,
                    source: updateSource,
                    closeAfterTimeout: closeCartAfterTimeout
                });

                return $q.resolve(cart);
            }

            /** Creates a new Cart Item.  If the cart hasn't been persisted yet, the
             * cart is created first.
             */
            function createCartItem(product, prices, qty) {
                //product.yrn

                var createItemDef = $q.defer();
                getOrCreateCart().then(function () {

                    var price = {
                        'priceId': prices[0].priceId,
                        'effectiveAmount': prices[0].effectiveAmount,
                        'originalAmount': prices[0].originalAmount,
                        'currency': prices[0].currency
                    };

                    if (prices[0].measurementUnit) {
                        price.measurementUnit = {
                            'unit': prices[0].measurementUnit.unitCode,
                            'quantity': prices[0].measurementUnit.quantity
                        };
                    }
                    var item = new Item(product, price, qty);

                    cart.items.push(item);
                    createItemDef.resolve();

                }, function () {
                    createItemDef.reject();
                });
                return createItemDef.promise;
            }


            function getProductInCart(cart, product) {
                return _.find((cart.items ? cart.items : []), function (item) {
                    if (item.itemYrn === product.itemYrn) {
                        return item;
                    }
                });
            }

            function reformatCartItems(cart) {
                var items = [];
                for (var i = 0; i < cart.items.length; i++) {
                    var item = {
                        itemId: cart.items[i].id,
                        itemYrn: cart.items[i].itemYrn,
                        productId: cart.items[i].product ? cart.items[i].product.id : '',
                        quantity: cart.items[i].quantity,
                        unitPrice: {
                            amount: cart.items[i].price.effectiveAmount,
                            currency: cart.items[i].price.currency
                        },
                        taxCode: cart.items[i].taxCode
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
                    cart.id = new Date().getMilliseconds();
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

                /**
                 * Retrieve any existing cart that there might be for an authenticated user, and merges it with
                 * any content in the current cart.
                 */
                refreshCartAfterLogin: function () {
                    var anonCart = cart;

                    cart = new Cart();
                    cart.id = new Date().getMilliseconds();

                    if (anonCart && anonCart.id) {
                        // create new cart for customer so anon cart can be merged into it

                        _.extend(cart, {
                            currency: GlobalData.getCurrencyId(),
                            siteCode: GlobalData.getSiteCode(),
                            channel: GlobalData.getChannel()
                        });
                    } else { // anonymous cart was never created
                        cart.currency = GlobalData.getCurrencyId();
                        cart.siteCode = GlobalData.getSiteCode();
                    }
                    return $q.resolve();
                },

                // Exposed for use in mixin services, like cart-note-mixin-service.js
                refreshCart: refreshCart,

                /** Persists the cart instance via PUT request (if qty > 0). Then, reloads that cart
                 * from the API for consistency and in order to display the updated calculations (line item totals, etc).
                 * @return promise to signal success/failure*/
                updateCartItemQty: function (item, qty) {
                    var updateDef = $q.defer();
                    if (qty > 0) {
                        refreshCart(cart.id, 'manual');
                        updateDef.resolve();
                    }
                    return updateDef.promise;
                },

                /**
                 * Removes a product from the cart, issues a PUT, and then a GET for the updated information.
                 * @param productId
                 */
                removeProductFromCart: function (itemId) {
                    cart.items = _.filter(cart.items, function (item) {
                        return item.id !== itemId;
                    });
                    refreshCart(cart.id, 'manual');
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

                        return ProductSvc.getProduct({productId: productId}).then(function (response) {
                            var product = response.product;
                            if (!_.has(product, 'itemYrn')) {
                                product.itemYrn = response.yrn;
                            }

                            product.mixins = response.mixins;
                            var item = getProductInCart(cart, product);
                            if (item) {
                                return self.updateCartItemQty(item, item.quantity + productDetailQty, config);
                            }
                            return createCartItem(product, prices, productDetailQty, config);
                        });

                    } else {
                        return $q.when({});
                    }
                },

                redeemCoupon: function (coupon) {
                    coupon = parseCoupon(coupon);
                    refreshCart(cart.id, 'manual');
                },

                removeAllCoupons: function () {
                    refreshCart(cart.id, 'manual');
                },

                removeCoupon: function () {
                    refreshCart(cart.id, 'manual');
                },

                getCalculateTax: function () {
                    if (!!cart && !!cart.countryCode && !!cart.zipCode) {
                        return {
                            countryCode: cart.countryCode,
                            zipCode: cart.zipCode,
                            taxCalculationApplied: true
                        };
                    }
                    return {taxCalculationApplied: false};
                },

                setCalculateTax: function () {
                    refreshCart(cart.id, 'manual');
                },

                recalculateCart: function (cart, addressToShip, shippingCostObject) {
                    var items = reformatCartItems(cart);
                    var discounts = [];
                    angular.forEach(cart.discounts, function (discount) {
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
                    return $q.resolve(data);
                }

            };

        }]);
