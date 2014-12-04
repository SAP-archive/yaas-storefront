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

describe('CartCtrl Test', function () {

    var $scope, $rootScope, $controller;

    //***********************************************************************
    // Common Setup
    // - shared setup between constructor validation and method validation
    //***********************************************************************

    // configure the target controller's module for testing - see angular.mock
    beforeEach(angular.mock.module('ds.cart'));

    beforeEach(inject(function(_$rootScope_, _$controller_, $q) {

        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });
        $rootScope =  _$rootScope_;
        $scope = _$rootScope_.$new();
        $controller = _$controller_;
    }));

    var cart, products, cartCtrl, stubbedCartSvc, mockedGlobalData;

    beforeEach(function () {
        cart = {};

        products = [
            {'name': 'Electric Guitar', 'id': 'guitar1234', 'price': 1000.00, 'quantity': 1},
            {'name': 'Acoustic Guitar', 'id': 'guitar5678', 'price': 800.00, 'quantity': 1}
        ];

        cart.items = products;

        // stubbing a service with callback
        stubbedCartSvc = {
            removeProductFromCart: jasmine.createSpy(),
            updateCartItem: jasmine.createSpy(),
            getCart: jasmine.createSpy().andReturn(cart),
            getLocalCart: jasmine.createSpy().andReturn(cart)
        };

        mockedGlobalData = {
            getCurrencySymbol: jasmine.createSpy('getCurrencySymbol').andReturn('$')
        };

        cartCtrl = $controller('CartCtrl', {$scope: $scope, 'CartSvc': stubbedCartSvc, 'GlobalData': mockedGlobalData});

        $rootScope.cart = products;
    });

    describe('remove from cart', function () {

        it(' should call service remove', function () {
            $scope.removeProductFromCart('guitar5678');
            expect(stubbedCartSvc.removeProductFromCart).toHaveBeenCalled();
        });

    });

    describe('close cart after timeout', function(){

        it('should call createCartTimeout', function(){
            expect($scope.cartShouldCloseAfterTimeout).toBe(false);
            $rootScope.$emit('cart:closeAfterTimeout');
            expect($scope.cartShouldCloseAfterTimeout).toBe(true);
            expect($scope.createCartTimeout).toHaveBeenCalled;
        });

        describe('create cart timeout method', function(){

            it('should call $apply', function(){
                expect($scope.cartShouldCloseAfterTimeout).toBe(false);
                $scope.createCartTimeout();
                expect($scope.$apply).toHaveBeenCalled;
                expect($scope.cartTimeOut).toMatch(/\d{1,}/)
            });
        });

        describe('mouse enters cart area', function(){
            it('should create the timeout', function(){
                $scope.cartHovered();
                expect($scope.cartTimeOut).toBeFalsy();
            })
        });

        describe('mouse leaves cart area', function(){
            it('should clear the timeout', function(){
                $scope.cartUnHovered();
                expect($scope.createCartTimeout).toHaveBeenCalled;

            })
        });

        describe('toggleCart', function () {
            it('should toggle the cart', function () {
                $scope.toggleCart();
                expect($rootScope.showCart).toEqualData(false);
            });
        });
    });



    describe('update line item', function () {

        it(' should call service update', function () {
            $scope.updateCartItem({}, 1);
            expect(stubbedCartSvc.updateCartItem).toHaveBeenCalled;
        });

        it(' should remove item if qty is zero', function () {
            $scope.updateCartItem({}, 0);
            expect(stubbedCartSvc.removeProductFromCart).toHaveBeenCalled;
        });

    });

    describe('test event watches', function () {
        it ('should set the scope cart to the event cart when cart updates', function () {
            var newCart = {
                id: '9876',
                items: [
                    {name: 'Bass Guitar', id: 'bass1234', price: 500, qty: 1}
                ],
                currency: 'USD'
            };

            $rootScope.$emit('cart:updated', {cart: newCart});

            expect($scope.cart).toEqualData(newCart);
        });
    });

    describe('toggle cart', function(){
        it('should set showCart to false', function(){
           $rootScope.showCart = true;
            $scope.toggleCart();
            expect($rootScope.showCart).toBeFalsy();
        });
    });



});
