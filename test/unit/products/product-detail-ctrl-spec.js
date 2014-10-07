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

    var $scope, $rootScope, $controller, $q, mockedCartSvc, mockedGlobalData={
        getCurrencySymbol: jasmine.createSpy('getCurrencySymbol').andReturn('USD')
    },
        mockedPriceSvc={
            query: jasmine.createSpy('query').andReturn({then: function(){}})
        };

    var mockProduct = {
        name: 'product1',
        price: '5000',
        published: true
    };

    var dummyImg = 'dummy';
    var mockedSettings = {
        placeholderImage: dummyImg
    };


    beforeEach(angular.mock.module('ds.products'));


    beforeEach(inject(function ($injector, _$rootScope_, _$controller_, _$q_) {
        $q = _$q_;
        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });
        $rootScope = _$rootScope_;
        $controller = _$controller_;
        $scope = $injector.get('$rootScope').$new();
    }));

    beforeEach(function () {
        // creating the mocked service
        mockedCartSvc = {
            addProductToCart: jasmine.createSpy()
        };

        $controller('ProductDetailCtrl', { $scope: $scope, $rootScope: $rootScope,
            'CartSvc': mockedCartSvc, 'product': mockProduct, 'settings': mockedSettings, 'GlobalData': mockedGlobalData,
            'PriceSvc': mockedPriceSvc});

    });

    it('should retrieve product price on init', function(){
       expect(mockedPriceSvc.query).wasCalled();
    });

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

    describe('initialization', function () {
        it('product without image should get default image', function () {
            expect($scope.product.images[0].url).toEqualData(dummyImg);
        });
    });

    describe('onCartUpdated', function () {
        beforeEach(function () {
            $scope.addToCartFromDetailPage();
            $rootScope.$broadcast('cart:updated');
        });

        it('should enable buy button', function () {
            expect($scope.buyButtonEnabled).toBeTruthy();
        });
    });


});
