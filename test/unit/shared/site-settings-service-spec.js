/**
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
describe('SiteSettingsSvc Test', function () {

    var $scope, $rootScope, $httpBackend, siteSettingsSvc, siteSettingsUrl;

    var mockStripeKey = {
        "configuration" : {
            "public" : {
                "option1" : "pk_mock"
            }
        }
    };

    beforeEach(module('restangular'));
    beforeEach(module('ds.shared', function ($provide) {
        $provide.constant('appConfig', {});
    }));

    beforeEach(function () {
        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });

        inject(function (_$httpBackend_, _$rootScope_, _SiteSettingsSvc_) {
            $rootScope = _$rootScope_;
            $scope = _$rootScope_.$new();
            $httpBackend = _$httpBackend_;
            siteSettingsSvc = _SiteSettingsSvc_;
            siteSettingsUrl = siteConfig.apis.siteSettings.baseUrl + 'sites/default/payment/stripe';
        });
    });

    describe('getStripeKey()', function () {
        it ('should get the stripe key', function () {
            $httpBackend.expectGET(siteSettingsUrl).respond(mockStripeKey);

            var stripeKey = siteSettingsSvc.getStripeKey();

            $httpBackend.flush();
            expect(stripeKey.$object.configuration.public.option1).toEqualData('pk_mock');
        });
    });

});