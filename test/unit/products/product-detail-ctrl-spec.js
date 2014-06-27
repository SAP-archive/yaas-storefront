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

describe('ProductDetailCtrl', function () {

    var mockedState, $scope, $rootScope, $controller, mockedCartSvc;

    beforeEach(function(){
        // creating the mocked service
        mockedCartSvc = {
            addProductToCart: jasmine.createSpy()
        };

        mockedState = {
            go: jasmine.createSpy()
        };
    });


    //***********************************************************************
    // Common Setup
    // - shared setup between constructor validation and method validation
    //***********************************************************************

    // configure the target controller's module for testing - see angular.mock
    beforeEach(angular.mock.module('ds.products'));


    beforeEach(inject(function($injector, _$rootScope_, _$controller_) {

        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });
        $rootScope =  _$rootScope_;
        $controller = _$controller_;
        $scope = $injector.get('$rootScope').$new();

    }));

    describe('published product', function () {
        var productDetailCtrl;

        beforeEach(function () {

            var mockProduct = {
                name: 'product1',
                price: '5000',
                published: true
            };

            productDetailCtrl = $controller('ProductDetailCtrl', {$state: mockedState, $scope: $scope, $rootScope: $rootScope,
                'CartSvc': mockedCartSvc, 'product': mockProduct});
        });

        it('should add to cart from detail page', function(){
            $scope.addToCartFromDetailPage();
            expect(mockedCartSvc.addProductToCart).toHaveBeenCalled();
        });
    });

    describe('unpublished product', function () {
        var mockedCartSvc, productDetailCtrl, mockProduct;

        beforeEach(function () {

            mockProduct = {
                name: 'product1',
                price: '5000',
                published: false
            };
        });

        it('should route to product list if unpublished product is accessed', function() {
            productDetailCtrl = $controller('ProductDetailCtrl', {$state: mockedState, $scope: $scope, $rootScope: $rootScope,
                'CartSvc': mockedCartSvc, 'product': mockProduct});
            expect(mockedState.go).toHaveBeenCalledWith('base.product');
        });

    });

});
