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

    //***********************************************************************
    // Common Setup
    // - shared setup between constructor validation and method validation
    //***********************************************************************

    // configure the target service's module for testing - see angular.mock

    beforeEach(angular.mock.module('ds.cart', function (caasProvider) {
        caasProvider.endpoint('cartItems').baseUrl('dummyUrl').route('dummyRoute');
        caasProvider.endpoint('cart', { cartId: '@cartId' }).baseUrl('dummyUrl').route('dummyRoute');
    }));

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
    }));

    var prod1, prod2, sku1, sku2;



    beforeEach(function () {
        sku1 =  'guitar1234';
        sku2 =  'guitar5678';
        prod1 =    {'name': 'Electric Guitar', 'sku': sku1, 'price': 1000.00};
        prod2 =    {'name': 'Acoustic Guitar', 'sku': sku2, 'price': 800.00};

        //cartSvc.emptyCart();
        cartSvc.addProductToCart(prod1, 1 );
        cartSvc.addProductToCart(prod2, 1);
    });

    describe(' delete from cart', function() {
        it(' should remove the item from the cart', function() {
            cartSvc.removeProductFromCart(sku1);
            expect(cartSvc.getCart().itemCount).toEqualData(1);
            expect(cartSvc.getCart().items[0].sku).toEqualData(sku2);
        });
    });

    describe('update line item with qty > 0', function() {
        it(' should update the qty', function() {
            var newQty = 4;
            cartSvc.updateLineItem(sku1, newQty, true);
            var actualQty = cartSvc.getCart().items[0].quantity;
            expect(actualQty === newQty);
        });
    });

    describe('update line item with qty = 0', function() {
        it(' DO REMOVE should remove the item', function() {
            cartSvc.updateLineItem(sku1, 0, false);
            expect(cartSvc.getCart().itemCount).toEqualData(1);
            expect(cartSvc.getCart().items.length).toEqualData(1);
        });

        it(' KEEP should keep the item', function() {
            cartSvc.updateLineItem(sku1, 0, true);
            expect(cartSvc.getCart().itemCount).toEqualData(1);
            expect(cartSvc.getCart().items.length).toEqualData(2);
        });
    });

    describe(' add to cart', function () {


        var newProduct;

        newProduct = {'name': 'Amplifier', 'sku': 'amp1234', 'price': 700.00};

        it(' should add the product to the cart', function () {
            cartSvc.addProductToCart(newProduct, 1);
            expect(cartSvc.getCart().itemCount).toEqualData(3);
        });

        it(' should increment the item qty if same item is added again', function(){

            cartSvc.addProductToCart(prod1, 4);

            var cart = cartSvc.getCart();
            expect(cart.itemCount).toEqualData(6);

            var qty = 0;
            for (var i = 0; i < cart.items.length; i++) {
                if (cart.items[i].sku === prod1.sku) {
                    qty = cart.items[i].quantity;
                    break;
                }
            }
            expect(qty).toBe(5);
        });

        /*    WILL BE REPLACED BY SERVICE
        it(' should create cart line item with image if product has image', function(){
             var withImage = {'name': 'bunny', 'sku': 'bunny134', 'price': 10.59, 'images':[{'url':'imgurl'}]};
             cartSvc.addProductToCart(withImage, 1);
             expect(cartSvc.getCart()).toEqualData(updated);
        });  */
    });

    describe('CartSvc - should calculate the subtotal', function () {

        it(' should properly calculate subtotal', function () {
            expect(cartSvc.getCart().subtotal).toEqualData(1800.00);
        });

    });

    describe('CartSvc - getCart', function(){

        it('should return cart items', function(){
           var cart = cartSvc.getCart();
           expect(cart.itemCount).toEqualData(2);
        });
    });

    describe('CartSvc - emptyCart', function() {
        it('should empty out the cart', function () {
            cartSvc.emptyCart();
            expect(cartSvc.getCart().itemCount).toEqualData(0);
        });
    });



});