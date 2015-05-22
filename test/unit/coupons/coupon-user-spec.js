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

describe('Coupon User Test:', function () {

    var $scope, $rootScope, $filter, $translate, mockBackend;
    var AuthSvc = {
        isAuthenticated: jasmine.createSpy('isAuthenticated').andReturn(true)
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
    var mockedCouponSvc = {
        getValidateCoupon:function(){}
    };
    function mockedTranslate(title) {
        return { then: function(callback){callback(title)}};
    }
    var UserCoupon = {};

    beforeEach(module('ds.coupon', function ($provide) {
        $provide.value('CouponSvc', mockedCouponSvc);
    }));

    beforeEach(function() {
        module('ds.shared', function ($provide) {
            $provide.constant('siteConfig', {} );
            $provide.value('AuthSvc', AuthSvc);
        });
    });

    beforeEach(inject(function(_$rootScope_, _UserCoupon_, _$httpBackend_) {
        $scope = _$rootScope_.$new();
        UserCoupon = _UserCoupon_;
        mockBackend = _$httpBackend_;
    }));

    describe('Coupon User', function () {

        it('should exist', function () {
            expect(UserCoupon).toBeDefined();
            expect(UserCoupon.applyCoupon).toBeDefined();
            expect(UserCoupon.getCoupon).toBeDefined();
            expect(UserCoupon.setCoupon).toBeDefined();
            expect(UserCoupon.setBlankCoupon).toBeDefined();
        });

        it('should get coupon', function () {
            var response = UserCoupon.getCoupon();
            expect(response).toBeDefined();
            expect(response.code).toBe(mockCoupon.code);
        });

        it('should set coupon', function () {
            var tstCoupon = angular.copy(mockCoupon);
            tstCoupon.code = 'TEST0';
            var response = UserCoupon.setCoupon(tstCoupon);
            expect(response).toBeDefined();
            expect(response.code).toBe('TEST0');
            UserCoupon.setBlankCoupon();
        });

        it('should set a blank coupon', function () {
            var response = UserCoupon.getCoupon();
            response.applied = true;
            response.valid = true;
            response.code = 'XYZ';
            UserCoupon.setBlankCoupon();
            response = UserCoupon.getCoupon();
            expect(response.code).toBe(mockCoupon.code);
            expect(response.applied).toBe(mockCoupon.applied);
            expect(response.valid).toBe(mockCoupon.valid);
        });

        it('should fail on bad cart data', function () {
            var cartData = {};
            var response = UserCoupon.applyCoupon('TEST1', cartData);
            expect(response).not.toBeDefined();
        });

        it('should apply a FIXED coupon', function () {

            var cartData = {subTotalPrice:9.99};
            var mockResponse = {
                discountType : 'ABSOLUTE',
                discountAbsolute: {amount:10}
            };
            var promise = mockedCouponSvc.getValidateCoupon = jasmine.createSpy('getValidateCoupon').andCallFake(function() {
                return {then: function(callback) { return callback(mockResponse); } }
            });
            var response = UserCoupon.applyCoupon('TEST1', cartData);

            mockBackend.expectGET('coupons/CouponCode').respond(200, response);

            expect(mockedCouponSvc.getValidateCoupon).toHaveBeenCalled();

        });

        it('should apply a PERCENTAGE coupon', function () {

            var cartData = {subTotalPrice:9.99};
            var mockResponse = {
                discountType : 'PERCENT',
                discountPercent: {amount:10}
            };
            var promise = mockedCouponSvc.getValidateCoupon = jasmine.createSpy('getValidateCoupon').andCallFake(function() {
                return {then: function(callback) { return callback(mockResponse); } }
            });
            var response = UserCoupon.applyCoupon('TEST1', cartData);

            mockBackend.expectGET('coupons/CouponCode').respond(200, response);

            expect(mockedCouponSvc.getValidateCoupon).toHaveBeenCalled();

        });


    });

});
