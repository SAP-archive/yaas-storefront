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

    var $scope, $rootScope;
    var CartREST = {
    };
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
    var UserCoupon = {};

    beforeEach(module('ds.cart', function ($provide) {
        // $provide.value('$translate', mockedTranslate);
        // $provide.value('$state', mockedState);
    }));

    beforeEach(module('ds.coupon', function ($provide) {
        // $provide.value('$translate', mockedTranslate);
        // $provide.value('$state', mockedState);
    }));

    beforeEach(function() {
        module('ds.shared', function ($provide) {
            $provide.constant('appConfig', {} );
        });
    });

    beforeEach(function() {
        module('restangular');
    });

    beforeEach(inject(function(_SiteConfigSvc_, _CouponSvc_, _UserCoupon_, _$rootScope_, _CouponREST_, CartREST) {
        $scope = _$rootScope_.$new();
        UserCoupon = _UserCoupon_;
        CouponREST = _CouponREST_;
        // CartREST = _CartREST_;
    }));

    describe('Coupon Service ', function () {

        it('should exist', function () {
            // expect(UserCoupon.getCoupon).toBeDefined();
        });

    });

});
