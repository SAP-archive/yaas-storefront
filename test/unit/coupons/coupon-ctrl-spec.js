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

describe('Coupon Ctrl Test: ', function () {

    var $scope, $rootScope, $controller;
    var mockedCouponSvc = {
    };
    var mockCoupon = {
            code: '',
            applied: false,
            valid: true,
            message : {
                error: 'Code not valid',
                success: 'Applied'
            },
            amounts : {
                originalAmount: 0,
                discountAmount: 0
            }
        };
    var UserCoupon = {
        getCoupon:function(){
            return mockCoupon;
        },
        setBlankCoupon: jasmine.createSpy('setBlankCoupon').andReturn(mockCoupon)
    };
    var AuthDialogManager = {
        isOpened: jasmine.createSpy('then'),
        open: jasmine.createSpy('open').andReturn({
            result: {
                then: jasmine.createSpy('then')
            }
        }),
        close: jasmine.createSpy('dismiss')
    };

    var isAuthenticated = true;
    var AuthSvc = {
        isAuthenticated: jasmine.createSpy('isAuthenticated').andReturn(isAuthenticated)
    };

    beforeEach(module('ds.coupon', function ($provide) {
    }));

    beforeEach(inject(function(_$rootScope_, _$controller_, _$q_) {
        $scope = _$rootScope_.$new();
        $controller = _$controller_;
        $q =  _$q_;

        var couponDeferred = $q.defer();
        mockedCouponSvc.validateCoupon = jasmine.createSpy('validateCoupon').andCallFake(function() {
            return couponDeferred.promise;
        });


    }));

    describe('Coupon Ctrl ', function () {

        beforeEach(function () {
            couponCtrl = $controller('CouponCtrl', {$scope: $scope, AuthSvc:AuthSvc, AuthDialogManager:AuthDialogManager, CouponSvc:mockedCouponSvc, UserCoupon:UserCoupon });
        });

        it('should exist', function () {
            expect($scope.applyCoupon).toBeDefined();
            expect($scope.removeCoupon).toBeDefined();
            expect($scope.checkAuthentication).toBeDefined();
            expect(mockedCouponSvc.validateCoupon).toBeDefined();
        });

        it('should apply a coupon', function () {
            $scope.cart = {
                totalPrice : {
                    value: 9.99
                }
            };
            $scope.applyCoupon('CouponCode');
            expect(mockedCouponSvc.validateCoupon).toHaveBeenCalled();
        });

        it('should remove a coupon', function () {
            $scope.removeCoupon();
            expect(UserCoupon.setBlankCoupon).toHaveBeenCalled();
        });

        it('should show a login to unauthenticated user', function () {
            var response = $scope.checkAuthentication('CouponCode');
            expect(response).toBe(true);
        });


    });

});
