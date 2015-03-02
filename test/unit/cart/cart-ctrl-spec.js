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

    var $scope, $rootScope, $controller, $injector;

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

    var cart, products, cartCtrl, stubbedCartSvc, mockedGlobalData, mockedSettings, mockedAuthSvc, mockedAuthDialogManager, mockedState;

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

        mockedState = {
            go: jasmine.createSpy()
        };

        mockedGlobalData = {
            getCurrencySymbol: jasmine.createSpy('getCurrencySymbol').andReturn('$')
        };

        mockedSettings = {
            homeState: 'base.home'
        };

        mockedAuthSvc = {
            isAuthenticated: jasmine.createSpy().andReturn(false)
        };

        mockedAuthDialogManager = {
            open: jasmine.createSpy().andReturn({
                then: jasmine.createSpy()
            }),
            close: jasmine.createSpy()
        };

        cartCtrl = $controller('CartCtrl', {$scope: $scope, $state: mockedState, $rootScope: $rootScope, 'CartSvc': stubbedCartSvc,
            'GlobalData': mockedGlobalData, 'settings': mockedSettings, 'AuthSvc': mockedAuthSvc, 'AuthDialogManager': mockedAuthDialogManager});

        $rootScope.cart = products;
    });

    describe('remove from cart', function () {

        it(' should call service remove', function () {
            $scope.removeProductFromCart('guitar5678');
            expect(stubbedCartSvc.removeProductFromCart).toHaveBeenCalled();
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

    it('should toggle the cart', function () {
        $rootScope.showCart = true;
        $scope.toggleCart();
        expect($rootScope.showCart).toEqualData(false);
    });

    it('should go to the checkout details page', function () {
        /*
         the keepCartOpen function is now in the cart auto toggle directive so we must mock it
         */
        $scope.keepCartOpen = function () {};
        $scope.toCheckoutDetails();
    });

});
