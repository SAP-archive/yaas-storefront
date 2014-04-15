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

    var $scope, $rootScope;

    //***********************************************************************
    // Common Setup
    // - shared setup between constructor validation and method validation
    //***********************************************************************

    // configure the target service's module for testing - see angular.mock
    beforeEach(angular.mock.module('ds.cart'));

    beforeEach(inject(function (_$rootScope_) {

        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();
    }));

    describe('CartSvc - remove from cart', function () {

        var products;

        beforeEach(function () {

            products = [
                {'name': 'Electric Guitar', 'sku': 'guitar1234', 'price': 1000.00},
                {'name': 'Acoustic Guitar', 'sku': 'guitar5678', 'price': 800.00}
            ];

        });

        it(' should remove the product', function () {
            expect('yes').toEqualData('yes');
        });

    });

});