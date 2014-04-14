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

    var $scope, mockedCartSvc, cartCtrl;

    beforeEach(module('ds.cart'));

    beforeEach(module(function($provide) {
        mockedCartSvc = {
            getCart: function() {
                return [
                    {'name': 'Coffee Mug', 'price': 5.00, 'sku': 'mug123'},
                    {'name': 'Bike', 'price': 100.00, 'sku': 'bike456'}
                ];
            }
        };

        $provide.value('CartSvc', mockedCartSvc);

    }));

    beforeEach(inject(function(_$rootScope_, $controller) {
        $scope = _$rootScope_.$new();
        cartCtrl = $controller('CartCtrl', {$scope: $scope, 'CartSvc': mockedCartSvc});

        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });

    }));

});
