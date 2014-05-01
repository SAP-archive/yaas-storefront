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
    beforeEach(angular.mock.module('ds.cart'));

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

    var products;

    beforeEach(function () {

        products = [
            {'name': 'Electric Guitar', 'sku': 'guitar1234', 'price': 1000.00, 'quantity': 1},
            {'name': 'Acoustic Guitar', 'sku': 'guitar5678', 'price': 800.00, 'quantity': 1}
        ];

        $rootScope.cart = products;

    });

    describe('CartSvc - add to cart', function () {

        var newProduct;

        newProduct = {'name': 'Amplifier', 'sku': 'amp1234', 'price': 700.00};

        it(' should add the product to the cart', function () {
            cartSvc.addProductToCart(newProduct, 1);
            expect($rootScope.cart.length).toEqualData(3);
        });

        it(' should increment the item qty if same item is added again', function(){
             var same = {'name': 'Electric Guitar', 'sku': 'guitar1234', 'price': 1000.00};
             var updated =   [ {'name': 'Electric Guitar', 'sku': 'guitar1234', 'price': 1000.00, 'quantity': 5},
                 {'name': 'Acoustic Guitar', 'sku': 'guitar5678', 'price': 800.00, 'quantity': 1}];
            cartSvc.addProductToCart(same, 4);
            expect(cartSvc.getCart()).toEqualData(updated);
        });

        it(' should create cart line item with image if product has image', function(){
             var withImage = {'name': 'bunny', 'sku': 'bunny134', 'price': 10.59, 'images':[{'url':'imgurl'}]};

             var updated =   [ {'name': 'Electric Guitar', 'sku': 'guitar1234', 'price': 1000.00, 'quantity': 1},
                 {'name': 'Acoustic Guitar', 'sku': 'guitar5678', 'price': 800.00, 'quantity': 1},
                 {'name': 'bunny', 'sku': 'bunny134', 'price': 10.59, 'quantity': 1, 'imageUrl':'imgurl'}];
             cartSvc.addProductToCart(withImage, 1);
             expect(cartSvc.getCart()).toEqualData(updated);
        });
    });



    describe('CartSvc - remove from cart', function () {

        it(' should remove the product from the cart', function () {
            cartSvc.removeProductFromCart('guitar5678');
            expect($rootScope.cart.length).toEqualData(1);
        });

    });

    describe('CartSvc - should calculate the subtotal', function () {

        it(' should properly calculate subtotal', function () {
            expect(cartSvc.calculateSubtotal()).toEqualData(1800.00);
        });

    });

    describe('CartSvc - getCart', function(){

        it('should return cart items', function(){
           var cart = cartSvc.getCart();
           expect(cart).toEqualData(products);
        });
    });

    describe('CartSvc - emptyCart', function() {
        it('should empty out the cart', function () {
            cartSvc.emptyCart();
            expect(cartSvc.updateItemCount()).toEqualData(0);
        });
    });

    describe('CartSvc - update item count', function () {

        it('should update the item count', function () {
            var newProduct;

            newProduct = {'name': 'Amplifier', 'sku': 'amp1234', 'price': 700.00};

            cartSvc.addProductToCart(newProduct, 1);

            cartSvc.updateItemCount();

            expect($rootScope.itemCount).toEqualData(3);
        });
    });

});