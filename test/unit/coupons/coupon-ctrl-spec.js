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
    var CouponSvc = {
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
        }
    };
    var AuthDialogManager = {
        isOpened: jasmine.createSpy('then'),
        open: jasmine.createSpy('then').andReturn({
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
        // $provide.value('$translate', mockedTranslate);
        // $provide.value('$state', mockedState);
    }));

    beforeEach(inject(function(_$rootScope_, _$controller_) {
        $scope = _$rootScope_.$new();
        $controller = _$controller_;
    }));

    describe('Coupon Ctrl ', function () {

        beforeEach(function () {
            couponCtrl = $controller('CouponCtrl', {$scope: $scope, AuthSvc:AuthSvc, AuthDialogManager:AuthDialogManager, CouponSvc:CouponSvc, UserCoupon:UserCoupon });
        });

        it('should exist', function () {
            expect($scope.applyCoupon).toBeDefined();
            expect($scope.removeCoupon).toBeDefined();
            expect($scope.checkAuthentication).toBeDefined();
        });

    });

});
