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

    var mockBackend, $scope, $rootScope, cartSvc;
    var cartId = 'cartId456';
    var cartUrl = 'https://yaas-test.apigee.net/test/cart/v3/carts';
    var productUrl = 'https://yaas-test.apigee.net/test/product/v2/products';
    var prodId = '123';
    var prod1 = {'name': 'Electric Guitar', 'id': prodId, 'defaultPrice': {value: 5.00, currency: 'USD'}};
    var itemId = '0';
    var productIdFromCart = '540751ee394edbc101ff20f5';
    //var mockedProductSvc = {query: jasmine.createSpy('query').andReturn( {then:jasmine.createSpy('then')})};
    var mockedAccountSvc = {};
    var deferredAccount;
    var cartResponse = {
        "items" : [ {
            "id" : "0",
            "unitPrice" : {
                "currency" : "USD",
                "value" : 10.67
            },
            "product" : {
                "id" : productIdFromCart,
                "inStock" : false
            },
            "totalItemPrice" : {
                "currency" : "USD",
                "value" : 10.67
            },
            "quantity" : 1.0
        } ]
    };


    //***********************************************************************
    // Common Setup
    // - shared setup between constructor validation and method validation
    //***********************************************************************

    beforeEach(function () {
        module('restangular');
        module('ds.products');
        module('ds.cart', function($provide){
           // $provide.value('ProductSvc', mockedProductSvc);
            $provide.value('AccountSvc', mockedAccountSvc);
            $provide.value('GlobalData', { getCurrency: function (){
                return 'USD'
            }, getLanguage: function(){
                return 'en'
            }, getAcceptLanguages: function(){
                return 'en'
            }});
            $provide.value('storeConfig', {});
        });


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
        deferredAccount = _$q_.defer();
        mockedAccountSvc.getCurrentAccount =  jasmine.createSpy('getCurrentAccount').andReturn(deferredAccount.promise);
        deferredAccount.resolve({id:'abc', customerNumber: '123'});
        $scope.$apply();
        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });
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
            mockBackend.expectPOST(cartUrl + '/' + cartId + '/items', {"product":{"id":prodId},"unitPrice":{"value":5,"currency":"USD"},"quantity":2})
                .respond(201, {});

            var cartPromise = cartSvc.addProductToCart(prod1, 2);
            var successSpy = jasmine.createSpy();
            cartPromise.then(successSpy);

            mockBackend.expectGET(cartUrl + '/' + cartId).respond(200, cartResponse);
            mockBackend.expectGET(productUrl+'?q=id:('+productIdFromCart+')').respond(200, [{id: prodId, images: ['myurl']}]);
            mockBackend.flush();

            expect(successSpy).wasCalled();
        });

        it('should return failing promise if cart POST fails', function(){
            mockBackend.expectPOST(cartUrl).respond(500, {});

            var cartPromise = cartSvc.addProductToCart(prod1, 2);
            var failureSpy = jasmine.createSpy();
            cartPromise.then(function(){}, failureSpy);

            mockBackend.flush();
            expect(failureSpy).wasCalled();
        });

        it('should return failing promise if cart item POST fails', function(){
            mockBackend.expectPOST(cartUrl).respond({
                "cartId": cartId
            });
            mockBackend.expectPOST(cartUrl + '/' + cartId + '/items', {"product":{"id":prodId},"unitPrice":{"value":5,"currency":"USD"},"quantity":2})
                .respond(500, {});

            var cartPromise = cartSvc.addProductToCart(prod1, 2);
            var failureSpy = jasmine.createSpy();
            cartPromise.then(function(){}, failureSpy);
            mockBackend.expectGET(cartUrl + '/' + cartId).respond(200, cartResponse);
            mockBackend.expectGET(productUrl+'?q=id:('+productIdFromCart+')').respond(200, [{id: prodId, images: ['myurl']}]);
            mockBackend.flush();
            expect(failureSpy).wasCalled();
        });


    });


    describe('<<existing cart>>', function () {
        beforeEach(function () {
            mockBackend.expectPOST(cartUrl).respond({
                "cartId": cartId
            });
            mockBackend.expectPOST(cartUrl + '/' + cartId + '/items', {"product":{"id":prodId},"unitPrice":{"value":5,"currency":"USD"},"quantity":2})
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
            mockBackend.expectGET(productUrl+'?q=id:(123)').respond(200, [{id: prodId, images: ['myurl']}]);
            mockBackend.flush();
            var updatedCart = cartSvc.getLocalCart();
            expect(updatedCart.items.length).toEqualData(1);

        });

        describe('addProductToCart()', function () {

            it('should update qty of existing cart item if already in cart', function () {
                var updatedCart = cartSvc.getLocalCart();
                expect(updatedCart.items.length).toEqualData(1);
                mockBackend.expectPUT(cartUrl + '/' + cartId + '/items/' + itemId, {"product": {"id": prodId}, "unitPrice": {"currency": "USD", "value": 5}, "quantity": 3})
                    .respond(201, {});
                mockBackend.expectGET(cartUrl + '/' + cartId).respond(200, cartResponse);
                mockBackend.expectGET(productUrl+'?q=id:('+productIdFromCart+')').respond(200, [{id: prodId, images: ['myurl']}]);
                var promise = cartSvc.addProductToCart(prod1, 1);
                var successSpy = jasmine.createSpy();
                promise.then(successSpy);
                mockBackend.flush();
                expect(successSpy).wasCalled();
            });

            it('should return rejected promise if update fails', function(){
                mockBackend.expectPUT(cartUrl + '/' + cartId + '/items/' + itemId, {"product": {"id": prodId}, "unitPrice": {"currency": "USD", "value": 5}, "quantity": 3})
                    .respond(500, {});
                var promise = cartSvc.addProductToCart(prod1, 1);
                var failureSpy = jasmine.createSpy();
                promise.then(function(){}, failureSpy);
                mockBackend.flush();
                expect(failureSpy).wasCalled();
            });

            it('should return promise if attempting update with qty = 0', function(){
                var promise = cartSvc.addProductToCart(prod1, 0);
                $scope.$apply();
                expect(promise).toBeTruthy();
                expect(promise.then).toBeTruthy();
            });
        });

        describe('removeProductFromCart()', function () {
            it('should delete cart item', function () {
                mockBackend.expectDELETE(cartUrl+'/'+cartId+'/items/'+itemId).respond(200, {});
                mockBackend.expectGET(cartUrl + '/' + cartId).respond(200, cartResponse);
                mockBackend.expectGET(productUrl+'?q=id:('+productIdFromCart+')').respond(200, [{id: prodId, images: ['myurl']}]);
                cartSvc.removeProductFromCart(itemId);
                mockBackend.flush();
            });

            it('should set item error if delete fails', function(){
                mockBackend.expectDELETE(cartUrl+'/'+cartId+'/items/'+itemId).respond(500, {});
                cartSvc.removeProductFromCart(itemId);
                mockBackend.flush();
                expect(cartSvc.getLocalCart().items[0].error).toBeTruthy();
            });
        });

        describe('updateCartItem()', function(){
            it('should update cart item if qty > 0', function(){
                var item = cartSvc.getLocalCart().items[0];
                mockBackend.expectPUT(cartUrl + '/' + cartId + '/items/' + itemId, {"product": {"id": prodId}, "unitPrice": {"currency": "USD", "value": 5}, "quantity": 5})
                    .respond(201, {});
                mockBackend.expectGET(cartUrl + '/' + cartId).respond(200, cartResponse);
                mockBackend.expectGET(productUrl+'?q=id:('+productIdFromCart+')').respond(200, [{id: prodId, images: ['myurl']}]);
                cartSvc.updateCartItem(item, 5);
                mockBackend.flush();
            });

            it('should issue no calls if qty < 1', function(){
                var item = cartSvc.getLocalCart().items[0];
                cartSvc.updateCartItem(item, 0);
                mockBackend.verifyNoOutstandingRequest();
            });

            it('should set item error if update fails', function(){
                var item = cartSvc.getLocalCart().items[0];
                mockBackend.expectPUT(cartUrl + '/' + cartId + '/items/' + itemId, {"product": {"id": prodId}, "unitPrice": {"currency": "USD", "value": 5}, "quantity": 5})
                    .respond(500, {});
                cartSvc.updateCartItem(item, 5);
                mockBackend.flush();
                expect(cartSvc.getLocalCart().items[0].error).toBeTruthy();
            });
        });

        describe('resetCart', function() {
            it('should create an empty cart', function () {
                cartSvc.resetCart();
                expect(cartSvc.getLocalCart().items.length).toBeFalsy();
            });
        });

    });

    describe('getCart() for anonymous user', function() {
       it('should GET cart and retrieve product info', function(){
           var successCallback = jasmine.createSpy('success');
           var failureCallback = jasmine.createSpy('failure');
           mockBackend.expectGET(cartUrl).respond(200,
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
            mockBackend.expectGET(productUrl+'?q=id:(123)').respond(200, [{id: prodId, images: ['myurl']}]);
          var promise = cartSvc.getCart();
          promise.then(successCallback, failureCallback);
           mockBackend.flush();

           expect(successCallback).toHaveBeenCalled();
           expect(failureCallback).not.toHaveBeenCalled();

       });

        it('should GET cart and not retrieve product info if no line items', function(){
            var cart = null;

            mockBackend.expectGET(cartUrl).respond(200,
                {
                    "currency": "USD",
                    "subTotalPrice": {
                        "currency": "USD",
                        "value": 10.00
                    },
                    "totalUnitsCount": 1.0,
                    "customerId": "39328def-2081-3f74-4004-6f35e7ee022f",
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

            var promise = cartSvc.getCart();
            promise.then(function(result){
                cart = result;
            });
            mockBackend.flush();
           expect(cart).toBeTruthy();
           expect(cart.totalPrice.value).toEqualData(13.24);
        });

        it('should set cart error if GET results in non-404 error', function(){
            var cart = null;
            mockBackend.expectGET(cartUrl).respond(500,{});
            var promise = cartSvc.getCart();
            promise.then(function(result){cart = result});
            mockBackend.flush();
            expect(cart).toBeTruthy();
            expect(cart.error).toBeTruthy();
        });

        it('should not set cart error if GET results in 404', function(){
            var cart = null;
            mockBackend.expectGET(cartUrl).respond(404,{});
            var promise = cartSvc.getCart();
            promise.then(function(result){cart = result});
            mockBackend.flush();
            expect(cart).toBeTruthy();
            expect(cart.error).toBeFalsy();
        });
    });

});