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
            getCurrencySymbol: jasmine.createSpy('getCurrencySymbol').andReturn('USD')
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

    describe('update line item', function () {

        it(' should call service update', function () {
            $scope.updateCartItem({}, 1);
            expect(stubbedCartSvc.updateCartItem).toHaveBeenCalled;
        });

    });



});
