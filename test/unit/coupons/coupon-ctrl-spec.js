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

describe('CouponCtrl Test', function () {

    var $scope, $rootScope, $controller, $injector, $q;

    //***********************************************************************
    // Common Setup
    // - shared setup between constructor validation and method validation
    //***********************************************************************

    // configure the target controller's module for testing - see angular.mock


    var translateReturn = {
        then: jasmine.createSpy()
    };
    function mockedTranslate(title) {
        return { then: function(callback){callback(title)}};
    }

    beforeEach(angular.mock.module('ds.coupon'));
    beforeEach(module('ds.account', function ($provide) {
        $provide.value('$translate', mockedTranslate);
    }));

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

    var couponCtrl, mockCartSvc, mockCart, mockCouponSvc, mockAuthSvc, mockGlobalData, couponResult, products;

    beforeEach(function () {
        mockGlobalData = {
            getCurrencySymbol: jasmine.createSpy().andReturn('$')
        };

        mockCart = {
            id: 'cart1234',
            currency: 'USD'
        };

        products = [
            {'name': 'Electric Guitar', 'id': 'guitar1234', 'price': 1000.00, 'quantity': 1},
            {'name': 'Acoustic Guitar', 'id': 'guitar5678', 'price': 800.00, 'quantity': 1}
        ];

        mockCart.items = products;

        mockAuthSvc = {
            isAuthenticated: jasmine.createSpy().andReturn(true)
        };

    });

    describe('Coupon Tests', function () {

        beforeEach(function () {

            couponResult = {
                name: 'coupon1234',
                code: 'coupon1234',
                discountType: 'ABSOLUTE',
                discountAbsolute: {
                    amount: 5,
                    currency: 'USD'
                }
            };

            var deferredCoupon = $q.defer();
            deferredCoupon.resolve(couponResult);

            var deferredCart = $q.defer();
            deferredCart.resolve(mockCart);

            mockCouponSvc = {
                getCoupon: jasmine.createSpy().andReturn(deferredCoupon.promise)
            };

            mockCartSvc = {
                getLocalCart: jasmine.createSpy().andReturn(mockCart),
                redeemCoupon: jasmine.createSpy().andReturn(deferredCoupon.promise),
                removeAllCoupons: jasmine.createSpy().andReturn(deferredCart.promise)
            };

            couponCtrl = $controller('CouponCtrl', {$scope: $scope,$rootScope: $rootScope, 'CartSvc': mockCartSvc,
                'GlobalData': mockGlobalData,'AuthSvc': mockAuthSvc, 'CouponSvc': mockCouponSvc, '$translate': mockedTranslate});

        });

        it('should apply the coupon', function () {
            $scope.applyCoupon('coupon1234');

            expect(mockCouponSvc.getCoupon).toHaveBeenCalledWith('coupon1234');

            $scope.$apply();

            expect(mockCartSvc.redeemCoupon).toHaveBeenCalledWith(couponResult, $scope.cart.id);
        });

        it('should err if coupon has different currency than cart', function () {
            $scope.cart.currency = 'EUR';

            $scope.applyCoupon('coupon1234');

            expect(mockCouponSvc.getCoupon).toHaveBeenCalledWith('coupon1234');

            $scope.$apply();

            expect($scope.coupon.error).toEqualData({status: 'CURR'});
        });

        it('should remove all coupons', function () {
            $scope.removeAllCoupons();

            expect(mockCartSvc.removeAllCoupons).toHaveBeenCalledWith($scope.cart.id);
        });

        it('should update cart and currency symbol when the cart is updated', function () {
            var newCart = angular.copy(couponResult);
            newCart.currency = 'EUR';
            $rootScope.$broadcast('cart:updated', {cart: newCart, source: 'manual'});

            expect($scope.cart).toEqualData(newCart);
            expect(mockGlobalData.getCurrencySymbol).toHaveBeenCalledWith('EUR');
        });
    });

    describe('Coupon Error Tests', function () {
        it('should handle coupon redeem error', function () {
            var errorMessage = 'Could not redeem coupon';

            var couponGetResult = {
                name: 'coupon1234',
                code: 'coupon1234',
                discountType: 'ABSOLUTE',
                discountAbsolute: {
                    amount: 5,
                    currency: 'USD'
                }
            };

            var couponRedeemResult = {
                status: 400,
                data: {
                    details: [
                        {message: errorMessage}
                    ]
                }
            };

            var deferredGetCoupon = $q.defer();
            deferredGetCoupon.resolve(couponGetResult);

            var deferredRedeemCoupon = $q.defer();
            deferredRedeemCoupon.reject(couponRedeemResult);

            mockCouponSvc = {
                getCoupon: jasmine.createSpy().andReturn(deferredGetCoupon.promise)
            };

            mockCartSvc = {
                getLocalCart: jasmine.createSpy().andReturn(mockCart),
                redeemCoupon: jasmine.createSpy().andReturn(deferredRedeemCoupon.promise),
                removeAllCoupons: jasmine.createSpy()
            };

            couponCtrl = $controller('CouponCtrl', {$scope: $scope,$rootScope: $rootScope, 'CartSvc': mockCartSvc,
                'GlobalData': mockGlobalData,'AuthSvc': mockAuthSvc, 'CouponSvc': mockCouponSvc, '$translate': mockedTranslate});

            $scope.applyCoupon('coupon1234');

            $scope.$apply();

            expect(mockCartSvc.redeemCoupon).toHaveBeenCalled();

            expect($scope.couponErrorMessage).toEqualData(errorMessage);
        });

        it('should handle coupon GET 404', function () {
            var couponGetResult = {
                status: 404
            };

            var deferredCoupon = $q.defer();
            deferredCoupon.reject(couponGetResult);

            mockCouponSvc = {
                getCoupon: jasmine.createSpy().andReturn(deferredCoupon.promise)
            };

            couponCtrl = $controller('CouponCtrl', {$scope: $scope,$rootScope: $rootScope, 'CartSvc': mockCartSvc,
                'GlobalData': mockGlobalData,'AuthSvc': mockAuthSvc, 'CouponSvc': mockCouponSvc, '$translate': mockedTranslate});

            $scope.applyCoupon('coupon1234');

            $scope.$apply();

            expect(mockCouponSvc.getCoupon).toHaveBeenCalled();

            expect($scope.couponErrorMessage).toEqualData('COUPON_NOT_VALID');
        });

        it('should handle coupon GET 403 with customer logged in', function () {
            var couponGetResult = {
                status: 403
            };

            var deferredCoupon = $q.defer();
            deferredCoupon.reject(couponGetResult);

            mockCouponSvc = {
                getCoupon: jasmine.createSpy().andReturn(deferredCoupon.promise)
            };

            couponCtrl = $controller('CouponCtrl', {$scope: $scope,$rootScope: $rootScope, 'CartSvc': mockCartSvc,
                'GlobalData': mockGlobalData,'AuthSvc': mockAuthSvc, 'CouponSvc': mockCouponSvc, '$translate': mockedTranslate});

            $scope.applyCoupon('coupon1234');

            $scope.$apply();

            expect(mockCouponSvc.getCoupon).toHaveBeenCalled();

            expect($scope.couponErrorMessage).toEqualData('COUPON_NOT_VALID');
        });

        it('should handle coupon GET 403 with customer logged out', function () {
            var couponGetResult = {
                status: 403
            };

            mockAuthSvc = {
                isAuthenticated: jasmine.createSpy().andReturn(false)
            };

            var deferredCoupon = $q.defer();
            deferredCoupon.reject(couponGetResult);

            mockCouponSvc = {
                getCoupon: jasmine.createSpy().andReturn(deferredCoupon.promise)
            };

            couponCtrl = $controller('CouponCtrl', {$scope: $scope,$rootScope: $rootScope, 'CartSvc': mockCartSvc,
                'GlobalData': mockGlobalData,'AuthSvc': mockAuthSvc, 'CouponSvc': mockCouponSvc, '$translate': mockedTranslate});

            $scope.applyCoupon('coupon1234');

            $scope.$apply();

            expect(mockCouponSvc.getCoupon).toHaveBeenCalled();

            expect($scope.couponErrorMessage).toEqualData('COUPON_ERR_ANONYMOUS');
        });
    });

});
