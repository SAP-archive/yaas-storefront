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

describe('PricesService Test', function(){

    var $scope, $rootScope, $httpBackend, priceSvc, priceUrl;

    var priceResponse = {
        "prices" : [{
            "price" : 54.99,
            "productId" : "DummyProduct",
            "currencyId" : "USD",
            "priceId" : "538c9f9edd8eff306aab5cf1"
        }, {
            "price" : 199.95,
            "productId" : "AnotherDummyProduct",
            "currencyId" : "USD",
            "priceId" : "538c9fb7dd8eff306aab5d17"
        }]
    };


    beforeEach(angular.mock.module('ds.products',function($provide) {
       $provide.value('GlobalData', {});
       $provide.value('appConfig', {});

    }));

    beforeEach(function (){
        module('restangular');
        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });

        inject(function (_$httpBackend_, _$rootScope_, _PriceSvc_, SiteConfigSvc){
            $rootScope = _$rootScope_;
            $scope = _$rootScope_.$new();
            siteConfig = SiteConfigSvc;
            priceUrl = siteConfig.apis.prices.baseUrl + 'prices';
            $httpBackend = _$httpBackend_;
            priceSvc = _PriceSvc_;
        });
    });

    it('query return prices object with success handler invoking callback on resolved promise',function (){
        $httpBackend.expectGET(priceUrl).respond(priceResponse);
        var prices = priceSvc.query({});
        $httpBackend.flush();
        expect(prices.$object.prices).toEqualData(priceResponse.prices);
    });

});