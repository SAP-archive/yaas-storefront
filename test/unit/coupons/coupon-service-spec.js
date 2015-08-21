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

describe('Coupon Service Test:', function () {

    var $scope, $rootScope, couponUrl, cartUrl, mockBackend;
    var CouponREST = {};
    var CouponSvc = {};
    var CartSvc = {};
    var AuthSvc = {
        isAuthenticated: jasmine.createSpy('isAuthenticated').andReturn(true)
    };
    var mockCoupon = {
            code: 'test1',
            applied: false,
            valid: true,
            discountType: 'ABSOLUTE',
            discountAbsolute: {
                amount: 5,
                currency: 'USD'
            }
        };
    var mockCart = {
        id: 'cart123'
    };
    var storeTenant = '121212';
    var eng = 'English';
    var usd = 'US Dollar';
    var mockedGlobalData = {
        store: {tenant: storeTenant},
        setLanguage: jasmine.createSpy('setLanguage'),
        setCurrency: jasmine.createSpy('setCurrency'),
        getLanguageCode: function(){ return null},
        getCurrencyId: function() { return null},
        getCurrencySymbol: function () {return '$'},
        getAvailableLanguages: function() { return [{id:'en', label:eng}]},
        getAvailableCurrency: function() { return 'USD'},
        getCurrency: function() { return null},
        addresses:  {
            meta: {
                total: 0
            }
        },
        getCurrencyId: function () { return 'USD'; },
        getSiteCode: function () { return 'US'; }
    };

    var mockedAppConfig = {
        storeTenant: function(){
            return '121212/';
        },
        dynamicDomain: function(){
            return 'api.yaas.io';
        }
    };

    beforeEach(module('ds.cart', function ($provide) {
        $provide.value('AccountSvc', {});
        $provide.value('ProductSvc', {});
    }));

    beforeEach(module('ds.coupon', function ($provide) {
        $provide.value('GlobalData', mockedGlobalData);
    }));

    beforeEach(function() {
        module('ds.shared', function ($provide) {
            $provide.constant('appConfig', {} );
            $provide.value('GlobalData', mockedGlobalData);
            $provide.value('AuthSvc', AuthSvc);
            $provide.constant('appConfig', mockedAppConfig );
        });
    });

    beforeEach(function() {
        module('restangular');
    });

    beforeEach(inject(function( _CouponSvc_, _$rootScope_, _CouponREST_, _CartSvc_, _$httpBackend_, SiteConfigSvc) {
        $scope = _$rootScope_.$new();
        CouponREST = _CouponREST_;
        CouponSvc = _CouponSvc_;
        CartSvc = _CartSvc_;

        CartSvc.redeemCoupon = jasmine.createSpy();
        CartSvc.removeAllCoupons = jasmine.createSpy();

        mockBackend = _$httpBackend_;
        couponUrl = SiteConfigSvc.apis.coupon.baseUrl;
        cartUrl = SiteConfigSvc.apis.cart.baseUrl;
    }));

    describe('Coupon Service ', function () {

        it('should exist', function () {
            expect(CouponSvc.getCoupon).toBeDefined();
        });

        it("should get a coupon", function() {
            var getPayload = {"Accept":"application/json, text/plain, */*"};

            mockBackend.expectGET(couponUrl +'coupons/test1', getPayload).respond(200, {});

            CouponSvc.getCoupon('test1');

            mockBackend.flush();

        });

    });

});
