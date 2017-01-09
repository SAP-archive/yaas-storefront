/**
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

describe('CartSvc Test', function () {
    var mockBackend, $scope, $rootScope, cartSvc, siteConfig, cartUrl, productUrl, mockedGlobalData = {
        getTaxType: jasmine.createSpy('getTaxType').andReturn('AVALARA')
    };
    var mockedChannel = {
        'name':'yaas-storefront',
        'source':'shops.yaas.io'
    };
    var cartId = 'cartId456';
    var selectedSiteCode = 'europe123';
    var prodId = '123';
    var prod1 = {
        product: {
            name: 'Electric Guitar',
            id: prodId,
            itemYrn: 'urn:yaas:hybris:product:product:priceless;123',
            mixins: {
                inventory: {
                    inStock: false
                }
            }
        },
        categories: [
            {
                id: 12345,
                name: 'fakeCat',
                slug: 'fake-cat'
            }
        ],
        prices: [{
            effectiveAmount: 5.00,
            currency: 'USD'
        }]
    };

    var prod2Id = '2466';
    var prod2 = {
        product: {
            id: prod2Id,
            itemYrn: 'urn:yaas:hybris:product:product:priceless;2466',
        },
        prices: [{
            effectiveAmount: 6.00,
            currency: 'USD',
            measurementUnit: {unitCode: 'kg', quantity: 250}
        }]
    };

    var itemId = '0';
    var productIdFromCart = '540751ee394edbc101ff20f5';
    var mockedAccountSvc = {};

    var mockedState = {
        current: 'base.checkout',
        go: jasmine.createSpy(),
        transitionTo: jasmine.createSpy()
    };

    var deferredAccount;
    var cartResponse = {
        "items": [{
            "id": "0",
            "price": {
                "currency": "USD",
                "effectiveAmount": 10.67
            },
            "itemYrn":"urn:yaas:hybris:product:product:priceless;123",
            "product": {
                "id": productIdFromCart,
                "inStock": false
            },
            "totalItemPrice": {
                "currency": "USD",
                "amount": 10.67
            },
            "quantity": 1.0
        }],
        "currency": "USD",
        "siteCode": selectedSiteCode
    };


    //***********************************************************************
    // Common Setup
    // - shared setup between constructor validation and method validation
    //***********************************************************************

    beforeEach(function () {
        module('restangular');
        module('ds.products');
        module('ds.cart', function ($provide) {
            $provide.value('AccountSvc', mockedAccountSvc);
            $provide.value('GlobalData', mockedGlobalData);
            $provide.value('appConfig', {});
            $provide.value('$state', mockedState);
            $provide.value('$stateParams', {});
        });


        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            },

            toBeInError: function (expected) {
                return expected.error;
            }
        });
    });

    beforeEach(inject(function (_$httpBackend_, _$rootScope_, _$q_, CartSvc, SiteConfigSvc) {

        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();
        mockBackend = _$httpBackend_;
        cartSvc = CartSvc;
        siteConfig = SiteConfigSvc;
        cartUrl = siteConfig.apis.cart.baseUrl + 'carts';
        mockBackend.whenGET(/^[A-Za-z-/]*\.html/).respond({});
        deferredAccount = _$q_.defer();
        mockedAccountSvc.getCurrentAccount = jasmine.createSpy('getCurrentAccount').andReturn(deferredAccount.promise);
        deferredAccount.resolve({ id: 'abc', customerNumber: '123' });
        $scope.$apply();
        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });
        mockedGlobalData.getCurrencyId = jasmine.createSpy('getCurrencyId').andReturn('USD');
        mockedGlobalData.getAcceptLanguages = jasmine.createSpy('getAcceptLanguages').andReturn('en');
        mockedGlobalData.getSiteCode = jasmine.createSpy('getSiteCode').andReturn(selectedSiteCode);
        mockedGlobalData.getChannel = jasmine.createSpy('getChannel').andReturn(mockedChannel);

        productUrl = siteConfig.apis.products.baseUrl;
        mockBackend.whenGET(productUrl+'products/'+prod1.product.id).respond(200, prod1.product);
        mockBackend.whenGET(productUrl+'products/'+prod2.product.id).respond(200, prod2.product);
        mockBackend.whenGET(productUrl+'products?q=id:('+prod1.product.id+')').respond(200, [prod1.product]);
    }));

    describe('getLocalCart', function () {
        it('should return cart', function () {
            var cart = cartSvc.getLocalCart();
            expect(cart).toBeTruthy();
        });
    });

    describe('addProductToCart - new cart', function () {

        it('should create new cart, create cart item and GET new cart', function () {

            mockBackend.expectPOST(cartUrl).respond({
                "cartId": cartId
            });

            mockBackend.expectPOST(cartUrl + '/' + cartId + '/items', {
                "itemYrn" : prod1.product.itemYrn, "price": { "effectiveAmount": 5, "currency": "USD" }, "quantity": 2
            }).respond(201, {});

            var cartPromise = cartSvc.addProductToCart(prod1.product, prod1.prices, 2, {});
            var successSpy = jasmine.createSpy();
            cartPromise.then(successSpy);

            mockBackend.expectGET(cartUrl + '/' + cartId + '?siteCode=' + selectedSiteCode).respond(200, cartResponse);

            mockBackend.flush();

            expect(successSpy).wasCalled();
        });

        it('should return the units of measurement for a product for which measurement makes sense.', function () {
            mockBackend.expectPOST(cartUrl + '/' + cartId + '/items', {
                "itemYrn" : prod1.product.yrn,"price": {"effectiveAmount": 6,"currency": "USD","measurementUnit": {"unit": "kg","quantity": 250}},"quantity": 1
            }).respond(201, {});

            cartSvc.addProductToCart(prod2.product, prod2.prices, 1, {});
        });


        it('should return failing promise if cart POST fails', function () {
            mockBackend.expectPOST(cartUrl).respond(500, {});

            var cartPromise = cartSvc.addProductToCart(prod1.product, prod1.prices, 2, {});
            var failureSpy = jasmine.createSpy();
            cartPromise.then(function () { }, failureSpy);

            mockBackend.flush();
            expect(failureSpy).wasCalled();
        });

        it('should return failing promise if cart item POST fails', function () {
            mockBackend.expectPOST(cartUrl).respond({
                "cartId": cartId
            });
            mockBackend.expectPOST(cartUrl + '/' + cartId + '/items', { "itemYrn":"urn:yaas:hybris:product:product:priceless;123", "price": { "effectiveAmount": 5, "currency": "USD" }, "quantity": 2 })
                .respond(500, {});

            var cartPromise = cartSvc.addProductToCart(prod1.product, prod1.prices, 2, {});
            var failureSpy = jasmine.createSpy();
            cartPromise.then(function () { }, failureSpy);
            mockBackend.expectGET(cartUrl + '/' + cartId + '?siteCode=' + selectedSiteCode).respond(200, cartResponse);
            mockBackend.flush();
            expect(failureSpy).wasCalled();
        });


    });


    describe('<<existing cart>>', function () {
        beforeEach(function () {
            mockBackend.expectPOST(cartUrl).respond({
                "cartId": cartId
            });
            mockBackend.expectPOST(cartUrl + '/' + cartId + '/items', { "itemYrn": "urn:yaas:hybris:product:product:priceless;123", "price": { "effectiveAmount": 5, "currency": "USD" }, "quantity": 2 })
                .respond(201, {});
            cartSvc.addProductToCart(prod1.product, prod1.prices, 2, {});
            mockBackend.expectGET(cartUrl + '/' + cartId + '?siteCode=' + selectedSiteCode).respond(200,
                {
                    "currency": "USD",
                    "subTotalPrice": {
                        "currency": "USD",
                        "amount": 10.00
                    },
                    "totalUnitsCount": 1.0,
                    "customerId": "39328def-2081-3f74-4004-6f35e7ee022f",
                    "items": [
                        {
                            "itemYrn": "urn:yaas:hybris:product:product:priceless;123",
                            "price": {
                                "currency": "USD",
                                "effectiveAmount": 5.00
                            },
                            "id": itemId,
                            "quantity": 2.0
                        }
                    ],
                    "totalPrice": {
                        "currency": "USD",
                        "amount": 13.24
                    },
                    "id": cartId,
                    "shippingCost": {
                        "currency": "USD",
                        "amount": 3.24
                    },
                    "siteCode": selectedSiteCode
                });
            mockBackend.flush();
            var updatedCart = cartSvc.getLocalCart();
            expect(updatedCart.items.length).toEqualData(1);

        });

        describe('addProductToCart()', function () {

            it('should update qty of existing cart item if already in cart', function () {
                var updatedCart = cartSvc.getLocalCart();
                expect(updatedCart.items.length).toEqualData(1);
                mockBackend.expectPUT(cartUrl + '/' + cartId + '/items/' + itemId + '?partial=true', {"quantity": 3 })
                    .respond(201, {});
                mockBackend.expectGET(cartUrl + '/' + cartId + '?siteCode=' + selectedSiteCode).respond(200, cartResponse);

                var promise = cartSvc.addProductToCart(prod1.product, prod1.prices, 1, {});
                var successSpy = jasmine.createSpy();
                promise.then(successSpy);
                mockBackend.flush();
                expect(successSpy).wasCalled();
            });

            it('should return rejected promise if update fails', function () {
                mockBackend.expectPUT(cartUrl + '/' + cartId + '/items/' + itemId + '?partial=true', {"quantity": 3 })
                    .respond(500, {});
                var promise = cartSvc.addProductToCart(prod1.product, prod1.prices, 1, {});
                var failureSpy = jasmine.createSpy();
                promise.then(function () { }, failureSpy);
                mockBackend.flush();
                expect(failureSpy).wasCalled();
            });

            it('should return promise if attempting update with qty = 0', function () {
                var promise = cartSvc.addProductToCart(prod1.product, prod1.prices, 0, {});
                $scope.$apply();
                expect(promise).toBeTruthy();
                expect(promise.then).toBeTruthy();
            });
        });

        describe('removeProductFromCart()', function () {
            it('should delete cart item', function () {
                mockBackend.expectDELETE(cartUrl + '/' + cartId + '/items/' + itemId).respond(200, {});
                mockBackend.expectGET(cartUrl + '/' + cartId + '?siteCode=' + selectedSiteCode).respond(200, cartResponse);
                cartSvc.removeProductFromCart(itemId);
                mockBackend.flush();
            });

            it('should set item error if delete fails', function () {
                mockBackend.expectDELETE(cartUrl + '/' + cartId + '/items/' + itemId).respond(500, {});
                cartSvc.removeProductFromCart(itemId);
                mockBackend.flush();
                expect(cartSvc.getLocalCart().items[0].error).toBeTruthy();
            });
        });

        describe('updateCartItemQty()', function () {
            it('should update cart item if qty > 0', function () {
                var item = cartSvc.getLocalCart().items[0];
                mockBackend.expectPUT(cartUrl + '/' + cartId + '/items/' + itemId + '?partial=true', {"quantity": 5 })
                    .respond(201, {});
                mockBackend.expectGET(cartUrl + '/' + cartId + '?siteCode=' + selectedSiteCode).respond(200, cartResponse);
                cartSvc.updateCartItemQty(item, 5, {});
                mockBackend.flush();
            });

            it('should issue no calls if qty < 1', function () {
                var item = cartSvc.getLocalCart().items[0];
                cartSvc.updateCartItemQty(item, 0, {});
                mockBackend.verifyNoOutstandingRequest();
            });

            it('should set item error if update fails', function () {
                var item = cartSvc.getLocalCart().items[0];
                mockBackend.expectPUT(cartUrl + '/' + cartId + '/items/' + itemId + '?partial=true', {"quantity": 5 })
                    .respond(500, {});
                cartSvc.updateCartItemQty(item, 5, {});
                mockBackend.flush();
                expect(cartSvc.getLocalCart().items[0].error).toBeTruthy();
            });
        });

        describe('resetCart', function () {
            it('should create an empty cart', function () {
                cartSvc.resetCart();
                expect(cartSvc.getLocalCart().items.length).toBeFalsy();
            });
        });

    });

    describe('refreshCartAfterLogin() - customer has cart', function () {

        var custId = 'abc';

        beforeEach(function () {

        });

        it('should get the cart for the customer', function () {
            // no anonymous cart - initialize to blank cart
            mockBackend.expectGET(cartUrl + '?siteCode=' + selectedSiteCode).respond(404, {});
            cartSvc.getCart();
            mockBackend.flush();

            // should get cart for customer
            mockBackend.expectGET(cartUrl + '?customerId=' + custId).respond(200, {
                "currency": "USD",
                "items": [
                {
                    "product": {
                        "id": prodId
                    },
                    "price": {
                        "currency": "USD",
                        "effectiveAmount": 5.00
                    },
                    "id": itemId,
                    "quantity": 2.0
                }
                ],
                "id": cartId,
                "siteCode": selectedSiteCode
            });
        });

        xit('should merge the cart if there was an anonymous cart with items', function () {
            var anonCartId = 'anon123';
            var prodId2 = 'prod2';
            // Set existing anonymous cart in CartSvc scope:
            // should query anonymous cart - with items:
            mockBackend.expectGET(cartUrl + '?siteCode=' + selectedSiteCode).respond(200, {
                "currency": "USD",
                "items": [
                    {
                        "product": {
                          "id": prodId2
                        },
                        "itemYrn": "urn:yaas:hybris:product:product:priceless;2466",
                        "price": {
                            "currency": "USD",
                            "effectiveAmount": 5.00
                        },
                        "id": 'zsd458',
                        "quantity": 2.0
                    }
                ],
                "id": anonCartId,
                "siteCode": selectedSiteCode
            });
            cartSvc.getCart();
            mockBackend.flush();

            ////////////////////////////
            // Actual test setup

            // should get cart for customer
            mockBackend.expectGET(cartUrl + '?customerId=' + custId).respond(200, {
                "currency": "USD",
                "items": [
                    {
                        "product": {
                          "id": prodId
                        },
                        "itemYrn": "urn:yaas:hybris:product:product:priceless;123",
                        "price": {
                            "currency": "USD",
                            "effectiveAmount": 5.00
                        },
                        "id": itemId,
                        "quantity": 2.0
                    }
                ],
                "id": cartId,
                "siteCode": selectedSiteCode
            });

            // should issue merge request https://yaas-test.apigee.net/test/cart/v3/carts/cartId456/merge
            mockBackend.expectPOST(cartUrl + '/' + cartId + '/merge', { "carts": [anonCartId] }).respond(200, {});
            // should refresh current cart
            mockBackend.expectGET(cartUrl + '/' + cartId + '?siteCode=' + selectedSiteCode).respond(200, { currency: 'USD' });
            cartSvc.refreshCartAfterLogin(custId);
            mockBackend.flush();
        });

    });

    xdescribe('refreshCartAfterLogin() - customer doesn\'t have cart', function () {

        var custId = 'abc';

        it('should merge the cart if there was an anonymous cart with items', function () {
            var custCartId = '567';
            // initialize to anonymous car with items
            mockBackend.expectGET(cartUrl + '?siteCode=' + selectedSiteCode).respond(200, {
                "currency": "USD",
                "items": [
                    {
                        "itemYrn": "urn:yaas:hybris:product:product:priceless;123",
                        "price": {
                            "currency": "USD",
                            "effectiveAmount": 5.00
                        },
                        "id": itemId,
                        "quantity": 2.0
                    }
                ],
                "id": cartId,
                "siteCode": selectedSiteCode
            });
            cartSvc.getCart();
            mockBackend.flush();

            // no cart for user
            mockBackend.expectGET(cartUrl + '?customerId=' + custId).respond(404, {});
            // create cart for user
            mockBackend.expectPOST(cartUrl).respond(201, { cartId: custCartId });
            // merge anonymous cart into current cart
            mockBackend.expectPOST(cartUrl + '/' + custCartId + '/merge', { "carts": [cartId] }).respond(200, {});
            // refresh cart after merge:
            mockBackend.expectGET(cartUrl + '/' + custCartId + '?siteCode=' + selectedSiteCode).respond(200, { currency: 'USD' });
            cartSvc.refreshCartAfterLogin(custId);
            mockBackend.flush();
        });
    });


    describe('getCart() for anonymous user', function () {
        it('should GET cart and retrieve product info', function () {
            var successCallback = jasmine.createSpy('success');
            var failureCallback = jasmine.createSpy('failure');
            mockBackend.expectGET(cartUrl + '?siteCode=' + selectedSiteCode).respond(200,
                {
                    "currency": "USD",
                    "subTotalPrice": {
                        "currency": "USD",
                        "amount": 10.00
                    },
                    "totalUnitsCount": 1.0,
                    "customerId": "39328def-2081-3f74-4004-6f35e7ee022f",
                    "items": [
                        {
                            "itemYrn":"urn:yaas:hybris:product:product:priceless;123",
                            "product": {
                                "sku": "sku1",
                                "inStock": true,
                                "description": "desc",
                                "id": prodId,
                                "name": "Electric Guitar"
                            },
                            "price": {
                                "currency": "USD",
                                "effectiveAmount": 5.00
                            },
                            "id": itemId,
                            "quantity": 2.0
                        }
                    ],
                    "totalPrice": {
                        "currency": "USD",
                        "amount": 13.24
                    },
                    "id": cartId,
                    "shippingCost": {
                        "currency": "USD",
                        "amount": 3.24
                    },
                    "siteCode": selectedSiteCode
                });
            var promise = cartSvc.getCart();
            promise.then(successCallback, failureCallback);
            mockBackend.flush();

            expect(successCallback).toHaveBeenCalled();
            expect(failureCallback).not.toHaveBeenCalled();

        });

        it('should GET cart and not retrieve product info if no line items', function () {
            var cart = null;

            mockBackend.expectGET(cartUrl + '?siteCode=' + selectedSiteCode).respond(200,
                {
                    "currency": "USD",
                    "subTotalPrice": {
                        "currency": "USD",
                        "amount": 10.00
                    },
                    "totalUnitsCount": 1.0,
                    "customerId": "39328def-2081-3f74-4004-6f35e7ee022f",
                    "totalPrice": {
                        "currency": "USD",
                        "amount": 13.24
                    },
                    "id": cartId,
                    "shippingCost": {
                        "currency": "USD",
                        "amount": 3.24
                    },
                    "siteCode": selectedSiteCode
                });

            var promise = cartSvc.getCart();
            promise.then(function (result) {
                cart = result;
            });
            mockBackend.flush();
            expect(cart).toBeTruthy();
            expect(cart.totalPrice.amount).toEqualData(13.24);
        });

        it('should set cart error if GET results in non-404 error', function () {
            var cart = null;
            mockBackend.expectGET(cartUrl + '?siteCode=' + selectedSiteCode).respond(500, {});
            var promise = cartSvc.getCart();
            promise.then(function (result) { cart = result });
            mockBackend.flush();
            expect(cart).toBeTruthy();
            expect(cart.error).toBeTruthy();
        });

        it('should not set cart error if GET results in 404', function () {
            var cart = null;
            mockBackend.expectGET(cartUrl + '?siteCode=' + selectedSiteCode).respond(404, {});
            var promise = cartSvc.getCart();
            promise.then(function (result) { cart = result });
            mockBackend.flush();
            expect(cart).toBeTruthy();
            expect(cart.error).toBeFalsy();
        });

    });

    describe('coupon tests', function () {
        it('should redeem the coupon', function () {

            var mockCoupon = {
                code: 'test1',
                applied: false,
                valid: true,
                discountType: 'ABSOLUTE',
                discountAbsolute: {
                    amount: 5,
                    currency: 'USD'
                },
                amount: 5,
                currency: 'USD'
            };

            mockBackend.expectPOST(cartUrl + '/' + cartId + '/discounts', mockCoupon).respond(201, {});

            mockBackend.expectGET(cartUrl + '/' + cartId + '?siteCode=' + selectedSiteCode).respond(200, cartResponse);

            cartSvc.redeemCoupon(mockCoupon, cartId);

            mockBackend.flush();
        });

        it('should remove all coupons', function () {
            mockBackend.expectDELETE(cartUrl + '/' + cartId + '/discounts').respond(204, {});

            mockBackend.expectGET(cartUrl + '/' + cartId + '?siteCode=' + selectedSiteCode).respond(200, cartResponse);

            cartSvc.removeAllCoupons(cartId);

            mockBackend.flush();
        });

        it('should remove one coupon', function () {
            var couponId = '1234';
            mockBackend.expectDELETE(cartUrl + '/' + cartId + '/discounts/' + couponId).respond(204, {});
            mockBackend.expectGET(cartUrl + '/' + cartId + '?siteCode=' + selectedSiteCode).respond(200, cartResponse);

            cartSvc.removeCoupon(cartId, couponId);

            mockBackend.flush();
        });
    });

});
