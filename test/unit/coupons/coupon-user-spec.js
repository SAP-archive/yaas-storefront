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
            $provide.constant('appConfig', {} );
            $provide.constant('siteConfig', {} );
            $provide.value('AuthSvc', AuthSvc);
        });
    });

    beforeEach(inject(function(SiteConfigSvc, _$rootScope_, _UserCoupon_, _$httpBackend_, CouponSvc) {
        $scope = _$rootScope_.$new();
        $rootScope = _$rootScope_;
        UserCoupon = _UserCoupon_;
        mockBackend = _$httpBackend_;
        mockCouponSvc = CouponSvc;
        couponUrl = SiteConfigSvc.apis.coupon.baseUrl;
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

        it('event - should clear coupon on logout', function () {
            var blankCoupon, tstCoupon = mockCoupon;
            tstCoupon.code = "TEST4";
            UserCoupon.setCoupon(tstCoupon);

            $rootScope.$broadcast('coupon:logout');
            blankCoupon = UserCoupon.getCoupon();
            expect(blankCoupon.code).toBe('');
        });


        xit('event - should update the coupon when cart changes', function () {
            var diffCoupon, tstCoupon = mockCoupon;
            tstCoupon.code = "TEST5";
            tstCoupon.valid = false;
            tstCoupon.applied = false;
            UserCoupon.setCoupon(tstCoupon);


            //Mock coupon Svc
            mockedCouponSvc.getValidateCoupon = jasmine.createSpy('getValidateCoupon');

            $rootScope.$emit('coupon:cartupdate', { subTotalPrice: 10});

            expect(mockedCouponSvc.getValidateCoupon).toHaveBeenCalledWith({});
            expect(true).toBe(false);

            diffCoupon = UserCoupon.getCoupon();

            console.log('TESTCPN', tstCoupon);
            console.log('DIFFCPN', diffCoupon);
            expect(blankCoupon.code).toBe('');
        });


   });

    describe('Coupon Interactions', function(){
        it('should fail on bad cart data', function () {
            var cartData = {};
            var response = UserCoupon.applyCoupon('TEST1', cartData);
            expect(response).not.toBeDefined();
        });

        it('should apply a FIXED coupon', function () {

            var cartData = {subTotalPrice:11.99};
            var mockResponse = {
                discountType : 'ABSOLUTE',
                discountAbsolute: {amount:10}
            };
            mockedCouponSvc.getValidateCoupon = jasmine.createSpy('getValidateCoupon').andCallFake(function() {
                return {then: function(callback) { return callback(mockResponse); } }
            });
            var response = UserCoupon.applyCoupon('TEST4', cartData);


            expect(mockedCouponSvc.getValidateCoupon).toHaveBeenCalledWith( 'TEST4', 11.99);

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
            //mockBackend.expectGET(couponUrl +'coupons/CouponCode').respond(200, response);
            var response = UserCoupon.applyCoupon('TEST1', cartData);

            expect(mockedCouponSvc.getValidateCoupon).toHaveBeenCalledWith( 'TEST1', 9.99);

        });

        it('should zero out when fixed is less than total', function () {

            var cartData = {subTotalPrice:10};
            var mockResponse = {
                discountType : 'ABSOLUTE',
                discountAbsolute: {amount:10}
            };
            mockedCouponSvc.getValidateCoupon = jasmine.createSpy('getValidateCoupon').andCallFake(function() {
                return {then: function(callback) { return callback(mockResponse); } }
            });
            var response = UserCoupon.applyCoupon('TEST1', cartData);

            //mockBackend.expectGET('coupons/CouponCode').respond(200, response);

            expect(mockedCouponSvc.getValidateCoupon).toHaveBeenCalledWith( 'TEST1', 10 );

        });

    });


    describe('Coupon Fail', function(){

        xit('should fail on a bad coupon', function () {
            var response = {data:{message:'error'}};
            var cartData = {subTotalPrice:10};
            var mockResponse = {
                discountType : 'PERCENT',
                discountPercent: {amount:10}
            };

            mockBackend.expectGET(couponUrl + 'coupons/CouponCode/validate').respond(500, response);
            UserCoupon.applyCoupon('TEST3', cartData);
            expect(mockedCouponSvc.getValidateCoupon).toHaveBeenCalled();

        });

    });

});
