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
    var UserCoupon = {};

    beforeEach(module('ds.coupon', function ($provide) {
        // $provide.value('$translate', mockedTranslate);
        // $provide.value('$state', mockedState);
    }));

    beforeEach(inject(function(_UserCoupon_, _$rootScope_) {
        $scope = _$rootScope_.$new();
        UserCoupon = _UserCoupon_;
    }));

    describe('Coupon User ', function () {

        it('should exist', function () {
            expect(UserCoupon.getCoupon).toBeDefined();
        });

    });

});
