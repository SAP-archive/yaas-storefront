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

    describe('CartSvc - add to cart', function () {

        var products, newProduct;

        beforeEach(function () {

            products = [
                {'name': 'Electric Guitar', 'sku': 'guitar1234', 'price': 1000.00},
                {'name': 'Acoustic Guitar', 'sku': 'guitar5678', 'price': 800.00}
            ];

            newProduct = {'name': 'Amplifier', 'sku': 'amp1234', 'price': 700.00};

            $rootScope.cart = products;

        });

        it(' should add the product to the cart', function () {
            cartSvc.pushProductToCart(newProduct, 1);
            expect($rootScope.cart.length).toEqualData(3);
        });

    });

    describe('CartSvc - remove from cart', function () {

        var products;

        beforeEach(function () {

            products = [
                {'name': 'Electric Guitar', 'sku': 'guitar1234', 'price': 1000.00, 'quantity': 1},
                {'name': 'Acoustic Guitar', 'sku': 'guitar5678', 'price': 800.00, 'quantity': 1}
            ];

            $rootScope.cart = products;

        });

        it(' should remove the product from the cart', function () {
            cartSvc.removeProductFromCart('guitar5678');
            expect($rootScope.cart.length).toEqualData(1);
        });

    });

    describe('CartSvc - should calculate the subtotal', function () {

        var products;

        beforeEach(function () {

            products = [
                {'name': 'Electric Guitar', 'sku': 'guitar1234', 'price': 1000.00, 'quantity': 1},
                {'name': 'Acoustic Guitar', 'sku': 'guitar5678', 'price': 800.00, 'quantity': 1}
            ];

            $rootScope.cart = products;

        });

        it(' should properly calculate subtotal', function () {
            expect(cartSvc.calculateSubtotal()).toEqualData(1800.00);
        });

    });

});