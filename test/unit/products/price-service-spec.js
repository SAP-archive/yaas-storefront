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

    var priceUrlRest = 'http://price-v2.test.cf.hybris.com/prices';

    var $scope, $rootScope, $httpBackend, priceSvc;

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

    beforeEach(function() {
        module('restangular');
        module('ds.products');
        module('config')
    });

    beforeEach(function (){

        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });

        inject(function (_$httpBackend_, _$rootScope_, _PriceSvc_){
            $rootScope = _$rootScope_;
            $scope = _$rootScope_.$new();

            $httpBackend = _$httpBackend_;
            priceSvc = _PriceSvc_;
        });
    });

    it('query return prices object with success handler invoking callback on resolved promise',function (){
        $httpBackend.expectGET(priceUrlRest).respond(priceResponse);
        var prices = priceSvc.query({});
        $httpBackend.flush();
        expect(prices.$object.prices).toEqualData(priceResponse.prices);
    });

});