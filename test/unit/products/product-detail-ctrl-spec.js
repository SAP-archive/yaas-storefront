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

    var $scope, $rootScope, $controller, $q, mockedCartSvc, mockedCategorySvc, cartDef,mockedGlobalData={
        getCurrencySymbol: jasmine.createSpy('getCurrencySymbol').andReturn('USD')
    };

    var mockProduct = {
        name: 'product1',
        defaultPrice: {
            currency: 'USD',
            value: 5000
        },
        published: true,
        categories: [
            {
                id: 12345,
                name: 'fakeCat',
                slug: 'fake-cat'
            }
        ]
    };

    mockedCategorySvc = {
        getSlug: jasmine.createSpy().andReturn('fake-cat')
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
        cartDef = $q.defer();
        mockedCartSvc = {
            addProductToCart: jasmine.createSpy().andCallFake(function(){
                return cartDef.promise;
            })
        };

        $controller('ProductDetailCtrl', { $scope: $scope, $rootScope: $rootScope,
            'CartSvc': mockedCartSvc, 'CategorySvc': mockedCategorySvc, 'product': mockProduct, 'settings': mockedSettings, 'GlobalData': mockedGlobalData});

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

        it('should set error msg on error', function(){
            $scope.addToCartFromDetailPage();
            cartDef.reject();
            $scope.$apply();
            expect($scope.error).toBeTruthy();
        });

    });

    describe('initialization', function () {
        it('product without image should get default image', function () {
            expect($scope.product.images[0].url).toEqualData(dummyImg);
            expect($scope.catSlug).toEqualData('fake-cat');
        });
    });

    describe('onCartUpdated', function () {

        beforeEach(function () {
            $scope.error = 'error';
            $scope.addToCartFromDetailPage();
            $rootScope.$broadcast('cart:updated');
        });

        it('should show cart', function () {
            expect($rootScope.showCart).toBeTruthy();
        });

        it('should enable buy button', function () {
            expect($scope.buyButtonEnabled).toBeTruthy();
        });

        it('should remove any error', function(){
            expect($scope.error).toBeFalsy();
        })
    });


});
