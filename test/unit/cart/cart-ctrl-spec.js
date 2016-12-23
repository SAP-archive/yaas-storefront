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

    var $scope, $rootScope, $controller, $injector, $q;

    //***********************************************************************
    // Common Setup
    // - shared setup between constructor validation and method validation
    //***********************************************************************

    // configure the target controller's module for testing - see angular.mock
    beforeEach(angular.mock.module('ds.cart'));

    beforeEach(inject(function(_$rootScope_, _$controller_, _$q_) {

        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });
        $rootScope =  _$rootScope_;
        $scope = _$rootScope_.$new();
        $controller = _$controller_;
        $q = _$q_;
    }));

    var cart, products, cartCtrl, stubbedCartSvc, mockedGlobalData, mockedSettings, mockedAuthSvc, mockedAuthDialogManager, mockedState, mockedCouponSvc, mockedFeeSvc;

    beforeEach(function () {
        cart = {};

        products = [
            {'name': 'Electric Guitar', 'id': 'guitar1234', itemYrn: 'itemYrnForGuitar1234', 'price': 1000.00, 'quantity': 1},
            {'name': 'Acoustic Guitar', 'id': 'guitar5678', itemYrn: 'itemYrnForGuitar5678', 'price': 800.00, 'quantity': 1}
        ];

        cart.items = products;

        // stubbing a service with callback
        stubbedCartSvc = {
            removeProductFromCart: jasmine.createSpy(),
            updateCartItemQty: jasmine.createSpy(),
            getCart: jasmine.createSpy().andReturn($q.when(cart)),
            getLocalCart: jasmine.createSpy().andReturn(cart),
            getCalculateTax: jasmine.createSpy().andReturn({
                zipCode: '60606',
                countryCode: 'US',
                taxCalculationApplied: true
            })
        };

        mockedState = {
            go: jasmine.createSpy()
        };

        mockedGlobalData = {
            getCurrencySymbol: jasmine.createSpy('getCurrencySymbol').andReturn('$'),
            getTaxType: jasmine.createSpy('getTaxType').andReturn('AVALARA'),
            getCurrentTaxConfiguration: jasmine.createSpy('getCurrentTaxConfiguration').andReturn({ rate: "7", label: "Includes Tax/VAT", included: false }),
            getTaxableCountries: jasmine.createSpy('getTaxableCountries').andReturn([{id: 'US', name: 'USA'}, {id: 'CA', name: 'CANADA'}])
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

        mockedCouponSvc = {
            getCoupon: jasmine.createSpy('getCoupon'),
            redeemCoupon: jasmine.createSpy('redeemCoupon'),
            removeAllCoupons: jasmine.createSpy('removeAllCoupons')
        };

        mockedFeeSvc = {
            getFeesForItemYrnList: jasmine.createSpy('getFeesForItemYrnList').andReturn($q.when({}))
        };

        cartCtrl = $controller('CartCtrl', {$scope: $scope, $state: mockedState, $rootScope: $rootScope, 'CartSvc': stubbedCartSvc,
            'GlobalData': mockedGlobalData, 'settings': mockedSettings, 'AuthSvc': mockedAuthSvc,
            'CouponSvc': mockedCouponSvc, 'AuthDialogManager': mockedAuthDialogManager, 'FeeSvc': mockedFeeSvc});

        $rootScope.cart = products;
    });

    describe('loading controller ', function() {

        it('should fetch fees for the list of products returned by the cart service', function() {
            expect(stubbedCartSvc.getCart).toHaveBeenCalled();
            $scope.$apply();
            expect(mockedFeeSvc.getFeesForItemYrnList).toHaveBeenCalledWith(['itemYrnForGuitar1234', 'itemYrnForGuitar5678']);
        });

    });

    describe('remove from cart', function () {

        it(' should call service remove', function () {
            $scope.removeProductFromCart('guitar5678');
            expect(stubbedCartSvc.removeProductFromCart).toHaveBeenCalled();
        });

    });

    describe('update line item', function () {

        it(' should call service update', function () {
            $scope.updateCartItemQty({}, 1);
            expect(stubbedCartSvc.updateCartItemQty).toHaveBeenCalled;
        });

        it(' should remove item if qty is zero', function () {
            $scope.updateCartItemQty({}, 0);
            expect(stubbedCartSvc.removeProductFromCart).toHaveBeenCalled;
        });

    });

    describe('event watches ', function () {
        var newCart = {
            id: '9876',
            items: [
                {name: 'Bass Guitar', id: 'bass1234', itemYrn: 'itemYrnForBass1234', price: 500, qty: 1},
                {name: 'Piano', id: 'piano1234', itemYrn: 'itemYrnForPiano1234', price: 2000, qty: 1}
            ],
            currency: 'USD'
        };

        it ('should set the scope cart to the event cart when cart updates', function () {
            $rootScope.$emit('cart:updated', {cart: newCart});
            expect($scope.cart).toEqualData(newCart);
        });

        it('should get fees for products in the in-memory persisted cart when cart updates', function() {
            $rootScope.$emit('cart:updated', {cart: newCart});
            expect(mockedFeeSvc.getFeesForItemYrnList).toHaveBeenCalledWith(['itemYrnForBass1234', 'itemYrnForPiano1234']);
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
