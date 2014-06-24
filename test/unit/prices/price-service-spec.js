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

    var priceUrl = "http://dummy.price.url";
    var priceRoute = "/prices";
    var testUrl = priceUrl + priceRoute;
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

    beforeEach(angular.mock.module('ds.prices', function (caasProvider, $provide){
        caasProvider.endpoint('prices').baseUrl(priceUrl).route(priceRoute);
    }));

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
        var prices;
        $httpBackend.expectGET(testUrl).respond(priceResponse);

        var myCallback = function(result) {
            prices = result;
        }

        priceSvc.queryWithResultHandler({}, myCallback);
        $httpBackend.flush();
        expect(prices).toEqualData(priceResponse);
    });

});