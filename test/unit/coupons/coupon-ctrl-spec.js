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

    var $scope, $rootScope, $controller, AuthSvc;

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
        setCoupon:function(couponData){
            return mockCoupon;
        },
        setBlankCoupon: jasmine.createSpy('setBlankCoupon').andReturn(mockCoupon)
    };

    var authDialogDeferred, mockAuthDialogManager = {};

    beforeEach(module('ds.coupon', function ($provide) {
    }));

    beforeEach(inject(function(_$rootScope_, _$controller_, _$q_) {
        $scope = _$rootScope_.$new();
        $rootScope = _$rootScope_.$new();
        $controller = _$controller_;
        $q =  _$q_;

        authDialogDeferred = $q.defer();
        authDialogDeferred.then = function(){};
        mockAuthDialogManager = {
            isOpened: jasmine.createSpy('then'),
            open: jasmine.createSpy('open').andReturn( authDialogDeferred),
            close: jasmine.createSpy('close')
        };

        var couponDeferredValidate = $q.defer();
        mockedCouponSvc.validateCoupon = jasmine.createSpy('validateCoupon').andCallFake(function() {
            return couponDeferredValidate.promise;
        });

    }));

    describe('Coupon Ctrl ', function () {

        beforeEach(function () {

        AuthSvc = {
            isAuthenticated: jasmine.createSpy('isAuthenticated').andReturn(true)
        };
            couponCtrl = $controller('CouponCtrl', {$scope: $scope, AuthSvc:AuthSvc, AuthDialogManager:mockAuthDialogManager, CouponSvc:mockedCouponSvc, UserCoupon:UserCoupon });
        });

        it('should exist', function () {
            mockedCouponSvc.getCoupon = jasmine.createSpy('getCoupon').andCallFake(function() {
                return {then: function(callback) { return callback({}); } }
            });
            expect($scope.applyCoupon).toBeDefined();
            expect($scope.removeCoupon).toBeDefined();
            expect(mockedCouponSvc.getCoupon).toBeDefined();
            expect(mockedCouponSvc.validateCoupon).toBeDefined();
        });


        it('should call coupon event update', function () {
            var testCoupon = mockCoupon;
            testCoupon.code = '1234';
            $rootScope.$emit('coupon:updated', {e:{}, userCoupon: testCoupon});
            expect($scope.applyCoupon).toBeDefined();
            expect($scope.coupon).toEqual(testCoupon);
        });

        it('should call cart event update', function () {
            mockedCouponSvc.getCoupon = jasmine.createSpy('getCoupon').andCallFake(function() {
                return {then: function(callback) { return callback({}); } }
            });
            $rootScope.$emit('coupon:cartupdate');
        });

        it('should apply a PERCENT coupon', function () {
            $scope.cart = {
                totalPrice : {
                    value: 9.99
                },
                subTotalPrice: {
                    value: 11.99
                }
            };
            var couponData = {
                discountAbsolute:{
                    amount: 19.99
                },
                discountType: 'PERCENT'
            }

            mockedCouponSvc.getCoupon = jasmine.createSpy('getCoupon').andCallFake(function() {
                return {then: function(callback) { return callback(couponData); } }
            });

            $scope.applyCoupon('CouponCode');
            expect(mockedCouponSvc.getCoupon).toHaveBeenCalled();
        });

        it('should apply a ABSOLUTE coupon', function () {
            $scope.cart = {
                totalPrice : {
                    value: 9.99
                },
                subTotalPrice: {
                    value: 11.99
                }
            };
            var couponData = {
                discountAbsolute:{
                    amount: 9.99
                },
                discountType: 'ABSOLUTE'
            }

            mockedCouponSvc.getCoupon = jasmine.createSpy('getCoupon').andCallFake(function() {
                return {then: function(callback) { return callback(couponData); } }
            });

            $scope.applyCoupon('CouponCode');
            expect(mockedCouponSvc.getCoupon).toHaveBeenCalled();
        });

        it('should apply an ABSOLUTE ZERO coupon, with a larger discount than subtotal', function () {
            $scope.cart = {
                totalPrice : {
                    value: 9.99
                },
                subTotalPrice: {
                    value: 11.99
                }
            };
            var couponData = {
                discountAbsolute:{
                    amount: 19.99
                },
                discountType: 'ABSOLUTE'
            }

            mockedCouponSvc.getCoupon = jasmine.createSpy('getCoupon').andCallFake(function() {
                return {then: function(callback) { return callback(couponData); } }
            });

            $scope.applyCoupon('CouponCode');
            expect(mockedCouponSvc.getCoupon).toHaveBeenCalled();
        });

        it('should remove a coupon', function () {
            $scope.removeCoupon();
            expect(UserCoupon.setBlankCoupon).toHaveBeenCalled();
        });


    });


    describe('Coupon Ctrl without Authentication ', function () {

        beforeEach(function () {
            AuthSvc = {
                isAuthenticated: jasmine.createSpy('isAuthenticated').andReturn(false)
            };

            couponCtrl = $controller('CouponCtrl', {$scope: $scope, AuthSvc:AuthSvc, AuthDialogManager:mockAuthDialogManager, CouponSvc:mockedCouponSvc, UserCoupon:UserCoupon });
        });


    });

});
