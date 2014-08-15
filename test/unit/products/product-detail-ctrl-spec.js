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

    var $scope, $rootScope, $controller, mockedCartSvc;

    var mockProduct = {
        name: 'product1',
        price: '5000',
        published: true
    };

    var dummyImg = 'dummy';
    var mockedSettings = {
        placeholderImage: dummyImg
    };

    beforeEach(function(){
        // creating the mocked service
        mockedCartSvc = {
            addProductToCart: jasmine.createSpy()
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

    beforeEach(function () {
        $controller('ProductDetailCtrl', {$scope: $scope, $rootScope: $rootScope,
            'CartSvc': mockedCartSvc, 'product': mockProduct, 'settings': mockedSettings});

        describe('buy published product', function () {

            it('should add to cart from detail page', function () {
                $scope.addToCartFromDetailPage();
                expect(mockedCartSvc.addProductToCart).toHaveBeenCalled();
            });

            it('should disable Buy button', function () {
                $scope.addToCartFromDetailPage();
                expect($scope.buyButtonEnabled).toBeFalsy();
            });

        });

        describe('initialization', function(){
            it('product without image should get default image', function(){
                expect($scope.product.images[0].url).toEqualData(dummyImg);
            });
        });

        describe('onCartUpdated', function () {
            beforeEach(function(){
                $scope.addToCartFromDetailPage();
                $rootScope.$broadcast('cart:updated');
            });
            it('should show cart', function () {
                expect($rootScope.showCart).toBeTruthy();
            });

            it('should enable buy button', function () {
                expect($scope.buyButtonEnabled).toBeTruthy();
            });
        });
    });

});
