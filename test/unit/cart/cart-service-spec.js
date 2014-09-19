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

describe('CartSvc Test', function () {

    var mockBackend, $scope, $rootScope, $q, cartSvc;
    var cartId = 'cartId456';
    var cartUrl = 'http://cart-snapshot.test.cf.hybris.com/carts';
    var prodId = '123';
    var prod1 = {'name': 'Electric Guitar', 'id': prodId, 'defaultPrice': {price: 5.00, currency: 'USD'}};
    var itemId = '0';

    //***********************************************************************
    // Common Setup
    // - shared setup between constructor validation and method validation
    //***********************************************************************

    beforeEach(function () {
        module('restangular');
        angular.mock.module('ds.cart');

        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });
    });

    beforeEach(inject(function (_$httpBackend_, _$rootScope_, _$q_, CartSvc) {

        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();
        mockBackend = _$httpBackend_;
        cartSvc = CartSvc;
        mockBackend.whenGET(/^[A-Za-z-/]*\.html/).respond({});

        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });
    }));

    describe('getCart', function () {

        it('should return cart', function () {
            var cart = cartSvc.getCart();
            expect(cart).toBeTruthy();
        });
    });

    describe('new cart', function () {
        it('should create new cart if cart not yet saved, plus create cart item and get new cart', function () {
            mockBackend.expectPOST(cartUrl).respond({
                "cartId": cartId
            });
            mockBackend.expectPOST(cartUrl + '/' + cartId + '/items', {"product":{"id":"123"},"unitPrice":{"value":5},"quantity":2})
                .respond(201, {});
            cartSvc.addProductToCart(prod1, 2);
            mockBackend.expectGET(cartUrl + '/' + cartId).respond(200, {});
            mockBackend.flush();
        });
    });


    describe('existing cart', function () {
        beforeEach(function () {
            mockBackend.expectPOST(cartUrl).respond({
                "cartId": cartId
            });
            mockBackend.expectPOST(cartUrl + '/' + cartId + '/items', {"product": {"id": "123"}, "unitPrice": {"value": 5}, "quantity": 2})
                .respond(201, {});
            cartSvc.addProductToCart(prod1, 2);
            mockBackend.expectGET(cartUrl + '/' + cartId).respond(200,
                {
                    "currency": "USD",
                    "subTotalPrice": {
                        "currency": "USD",
                        "value": 10.00
                    },
                    "totalUnitsCount": 1.0,
                    "customerId": "39328def-2081-3f74-4004-6f35e7ee022f",
                    "items": [
                        {
                            "product": {
                                "sku": "sku1",
                                "inStock": true,
                                "description": "desc",
                                "id": prodId,
                                "name": "Electric Guitar"
                            },
                            "unitPrice": {
                                "currency": "USD",
                                "value": 5.00
                            },
                            "id": itemId,
                            "quantity": 2.0
                        }
                    ],
                    "totalPrice": {
                        "currency": "USD",
                        "value": 13.24
                    },
                    "id": cartId,
                    "shippingCost": {
                        "currency": "USD",
                        "value": 3.24
                    }
                });
            mockBackend.flush();
            var updatedCart = cartSvc.getCart();
            expect(updatedCart.items.length).toEqualData(1);

        });

        describe('addProductToCart()', function () {

            it('should update qty of existing cart item if already in cart', function () {
                var updatedCart = cartSvc.getCart();
                expect(updatedCart.items.length).toEqualData(1);
                mockBackend.expectPUT(cartUrl + '/' + cartId + '/items/' + itemId, {"product": {"id": prodId}, "unitPrice": {"currency": "USD", "value": 5}, "quantity": 3})
                    .respond(201, {});
                mockBackend.expectGET(cartUrl + '/' + cartId).respond(200, {});
                cartSvc.addProductToCart(prod1, 1);
                mockBackend.flush();
            });
        });

        describe('removeProductFromCart()', function () {
            it('should delete cart item', function () {
                mockBackend.expectDELETE(cartUrl+'/'+cartId+'/items/'+itemId).respond(200, {});
                mockBackend.expectGET(cartUrl + '/' + cartId).respond(200, {});
                cartSvc.removeProductFromCart(itemId);
                mockBackend.flush();
            });
        });

        describe('updateCartItem()', function(){
            it('should update cart item if qty > 0', function(){
                var item = cartSvc.getCart().items[0];
                mockBackend.expectPUT(cartUrl + '/' + cartId + '/items/' + itemId, {"product": {"id": prodId}, "unitPrice": {"currency": "USD", "value": 5}, "quantity": 5})
                    .respond(201, {});
                mockBackend.expectGET(cartUrl + '/' + cartId).respond(200, {});
                cartSvc.updateCartItem(item, 5);
                mockBackend.flush();
            });

            it('should issue no calls if qty < 1', function(){
                var item = cartSvc.getCart().items[0];
                cartSvc.updateCartItem(item, 0);
                mockBackend.verifyNoOutstandingRequest();
            });
        });

        describe('resetCart', function() {
            it('should create an empty cart', function () {
                cartSvc.resetCart();
                expect(cartSvc.getCart().items.length).toBeFalsy();
            });
        });

    });

});