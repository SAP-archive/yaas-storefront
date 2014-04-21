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

    var products, cartCtrl, stubbedCartSvc;

    beforeEach(function () {

        products = [
            {'name': 'Electric Guitar', 'sku': 'guitar1234', 'price': 1000.00, 'quantity': 1},
            {'name': 'Acoustic Guitar', 'sku': 'guitar5678', 'price': 800.00, 'quantity': 1}
        ];

        // stubbing a service with callback
        stubbedCartSvc = {
            removeProductFromCart: jasmine.createSpy(),
            calculateSubtotal: jasmine.createSpy(),
            updateItemCount: jasmine.createSpy()
        };

        cartCtrl = $controller('CartCtrl', {$scope: $scope, 'CartSvc': stubbedCartSvc});

        $rootScope.cart = products;
    });

    describe('CartCtrl - remove from cart', function () {

        it(' should remove the product', function () {
            $scope.removeProductFromCart('guitar5678');
            // validate that the service's remove function has been called
            expect(stubbedCartSvc.removeProductFromCart).toHaveBeenCalled();
        });

    });

    describe('CartCtrl - should update item count', function () {
        it(' should call function in service', function () {
            $scope.updateItemCount();
            expect(stubbedCartSvc.updateItemCount).toHaveBeenCalled();
        });
    });

    describe('CartCtrl - should update subtotal', function () {
        it(' should call function in service', function () {
            $scope.updateSubtotal();
            expect(stubbedCartSvc.calculateSubtotal).toHaveBeenCalled();
        });
    });

});
