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

describe('ProductDetailCtrl Test', function () {

    var $state, $scope, $rootScope, $controller;

    //***********************************************************************
    // Common Setup
    // - shared setup between constructor validation and method validation
    //***********************************************************************

    // configure the target controller's module for testing - see angular.mock
    beforeEach(angular.mock.module('ds.products'));

    beforeEach(angular.mock.module('ds.router'));

    beforeEach(inject(function($injector, _$rootScope_, _$controller_) {

        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });
        $rootScope =  _$rootScope_;
        $controller = _$controller_;
        $scope = $injector.get('$rootScope').$new();
        $state = $injector.get('$state');
    }));

    describe('ProductDetailCtrl ', function () {
        var mockedCartSvc, productDetailCtrl;

        beforeEach(function () {

            var mockProduct = {
                name: 'product1',
                price: '5000',
                published: true
            };

            // creating the mocked service
            mockedCartSvc = {
                addProductToCart: jasmine.createSpy()
            };

            productDetailCtrl = $controller('ProductDetailCtrl', {$state: $state, $scope: $scope, $rootScope: $rootScope,
                'CartSvc': mockedCartSvc, 'product': mockProduct});
        });


        it('should add to cart from detail page', function(){

            $scope.addToCartFromDetailPage();
            expect(mockedCartSvc.addProductToCart).toHaveBeenCalled();

        });

    });

});
