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
    var cartItemId = 'cartItemId123';

    var dummyUrl = 'http://cart-v1.test.cf.hybris.com/cartItems';
    var dummyRoute = '/dummyRoute';



    var fullUrl = dummyUrl;

    var fullUrlWithCart = 'http://cart-mashup-v1.test.cf.hybris.com/carts/cartId456/details';
    var cartUrl = 'http://cart-v1.test.cf.hybris.com/carts/cartId456';

    var sku1 =  'guitar1234';
    var prod1 =    {'name': 'Electric Guitar', 'id': sku1, 'price': 1000.00};

    //***********************************************************************
    // Common Setup
    // - shared setup between constructor validation and method validation
    //***********************************************************************

    beforeEach(function() {
        module('restangular');
        module('ds.cart');
    });

    beforeEach(inject(function (_$httpBackend_, _$rootScope_, CartSvc) {

        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();
        mockBackend = _$httpBackend_;
        cartSvc = CartSvc;
        mockBackend.whenGET(/^[A-Za-z-/]*\.html/).respond({});
    }));


    describe('Add-to-Cart', function(){

        it('should issue POST and refresh/GET', function(){
             mockBackend.expectPOST(fullUrl, {"cartItem":{"productId":sku1,"quantity":1}}).respond({
                 "cartId" : cartId,
                 "cartItemId" : cartItemId
             });
             mockBackend.expectGET(fullUrlWithCart).respond({});
             cartSvc.addProductToCart(prod1, 1 );
             mockBackend.flush();
        })

        it('should increment the item qty if same item is added again', function(){
            mockBackend.expectPOST(fullUrl, {"cartItem":{"productId":sku1,"quantity":1}}).respond({
                "cartId" : cartId,
                "cartItemId" : cartItemId
            });


            mockBackend.expectGET(fullUrlWithCart).respond(
                {"customerId":null,"totalPrice":{"priceId":null,"price":599.95,"currencyId":"USD"},
                    "subTotalPrice":{"priceId":null,"price":599.95,"currencyId":"USD"},
                    "shippingCost":{"priceId":null,"price":0.0,"currencyId":"USD"},
                    "totalUnitsCount":1.0,"cartItems":[
                    {"productId":sku1,"product":
                    {"images":[{"url":"http://dummyurl","id":null}],"inStock":true,"sku":null,"description":"Most famous way to make a cuppa","name":"Espresso Machine"},
                        "cartItemId":cartItemId,"quantity":1.0,
                        "unitPrice":{"priceId":"123","price":599.95,"currencyId":"USD"},
                        "totalPrice":{"priceId":null,"price":599.95,"currencyId":"USD"}}],"createdDate":null,"updatedDate":null}
            );
            cartSvc.addProductToCart(prod1, 1);
            mockBackend.flush();
            mockBackend.expectPUT(cartUrl, {"id": "cartId456", "cartItems":[{"productId":sku1,"quantity":2,"cartItemId":cartItemId}]}).respond({});
            mockBackend.expectGET(fullUrlWithCart).respond({});
            // mockBackend.expectPUT(fullUrlWithCart, {"cartItems":[{"productId":sku1,"quantity":2,"cartItemId":cartItemId}]}).respond({});
            // mockBackend.expectGET(fullUrlWithCart).respond({});
            cartSvc.addProductToCart(prod1, 1 );
            mockBackend.flush();
        });

    });

    describe('getCart', function(){

        it('should return cart', function(){
           var cart = cartSvc.getCart();
           expect(cart).toBeTruthy();
        });
    });



    describe('cart update', function(){
        beforeEach(function(){
            cartSvc.addProductToCart(prod1, 1);
            mockBackend.expectPOST(fullUrl, {"cartItem":{"productId":sku1,"quantity":1}}).respond({
                "cartId" : cartId,
                "cartItemId" : cartItemId
            });
            mockBackend.expectGET(fullUrlWithCart).respond({"cartItems":[{"productId":sku1,"quantity":1,"cartItemId":cartItemId}]});
            mockBackend.flush();
        });

        describe('resetCart', function() {
            it('should create new cart without id', function () {
                cartSvc.resetCart();
                var cart = cartSvc.getCart();
                expect(cart.id).toBeFalsy();
            });
        });

        describe('removeProductFromCart', function() {
            it('should should issue PUT with qty = 0', function () {
                mockBackend.expectPUT(cartUrl, {"id":"cartId456","cartItems":[{"productId":"guitar1234","quantity":0,"cartItemId":"cartItemId123"}]}).respond({});
                mockBackend.expectGET(fullUrlWithCart).respond({});
                cartSvc.removeProductFromCart(sku1);
                mockBackend.flush();
            });
        });

        describe('updateProductQty with qty > 0', function(){
            it('should should issue PUT with qty > 0', function () {
                mockBackend.expectPUT(cartUrl, {"id":"cartId456","cartItems":[{"productId":"guitar1234","quantity":2,"cartItemId":"cartItemId123"}]}).respond({});
                mockBackend.expectGET(fullUrlWithCart).respond({});
                var cart = cartSvc.getCart();
                cart.cartItems[0].quantity = 2;
                cartSvc.updateCart();
                mockBackend.flush();
            });
        });

    })

    describe('addItemToCart', function(){
       it('should create new cart if cart not yet saved', function(){

       });

       it('should create new cart item if item not yet in cart', function(){

       });

       it('should update qty of existing cart item if already in cart', function(){

       });
    });

    describe('removeItemFromCart', function(){
       it('should delete cart item', function(){

       });
    });

    describe('update cart item qty', function(){
       it('should update cart item if qty > 0', function(){

       });

       it('should delete cart item if qty == 0', function(){

       });
    });

});