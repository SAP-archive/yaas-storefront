/**
 * [y] hybris Platform
 *
 * Copyright (c) 2000-2016 hybris AG
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of hybris
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with hybris.
 */
describe('ShippingSvc', function() {

    var $scope, $rootScope, shippingSvc, mockedGlobalData;

    var baseUrl = 'https://api.yaas.io/hybris/shipping/v1';

    var item = {
        'cartTotal': {
            'amount': 100.34,
            'currency': 'USD'
        },
        'shipToAddress': {
            'street': '6 W Street',
            'streetNumber': '1',
            'zipCode': '60656',
            'city': 'Chicago',
            'state': 'IL',
            'country': 'US'
        }
    };

    mockedGlobalData = {
        user: {
            isAuthenticated: '',
            user: null
        },
        getSiteCode: jasmine.createSpy().andReturn('US'),
        getCurrencyId: jasmine.createSpy().andReturn('USD'),
        getAcceptLanguages: jasmine.createSpy().andReturn('en')
    };

    beforeEach(function () {
        module('restangular');
        module('ds.checkout');
    });

    beforeEach(module('ds.shared', function($provide) {
        $provide.value('appConfig', {
            dynamicDomain: function () {
                return 'api.yaas.io';
            },
            storeTenant: function () {}
        });
    }));

    beforeEach(module('ds.checkout', function($provide) {
        $provide.value('GlobalData', mockedGlobalData);
    }));

    describe('ShippingSvc', function() {

        beforeEach(function () {

            inject(function (_$httpBackend_, _$rootScope_, _ShippingSvc_, ShippingREST) {
                $rootScope = _$rootScope_;
                $scope = _$rootScope_.$new();
                $httpBackend = _$httpBackend_;
                shippingSvc = _ShippingSvc_;
                ShippingREST.ShippingZones.setBaseUrl(baseUrl);
            });

        });

        it('should issue GET shipping costs', function () {
            $httpBackend.expectGET(baseUrl + '/US/zones?activeMethods=true&expand=methods,fees').respond([]);
            shippingSvc.getSiteShippingZones();
            $httpBackend.flush();
        });

        it('should issue POST shipping costs', function () {
            $httpBackend.expectPOST(baseUrl + '/US/quote').respond({});
            shippingSvc.getShippingCosts(item);
            $httpBackend.flush();
        });

        describe('isShippingConfigured', function () {

            var zones;

            it('isShippingConfigured should return false if zones are not configured', function() {
                expect(shippingSvc.isShippingConfigured(zones)).toBeFalsy();
            });

            it('isShippingConfigured should return false if zones are not configured', function() {
                zones = [];
                expect(shippingSvc.isShippingConfigured(zones)).toBeFalsy();
            });

            it('isShippingConfigured should return false if methods are not configured', function() {
                zones = [{'id': 'europe','name': 'Europe','default': true,'shipTo': ['DE']}];
                expect(shippingSvc.isShippingConfigured(zones)).toBeFalsy();
            });

            it('isShippingConfigured should return true if methods are disabled', function() {
                zones = [{'id': 'europe','name': 'Europe','default': true,'shipTo': ['DE'], 'methods': []}];
                expect(shippingSvc.isShippingConfigured(zones)).toBeFalsy();
            });

            it('isShippingConfigured should return true if shipping are configured', function() {
                zones = [{'id': 'europe','name': 'Europe','default': true,'shipTo': ['DE'], 'methods': [{'id': 'fedex-2dayground'}]}];
                expect(shippingSvc.isShippingConfigured(zones)).toBeTruthy();
            });


        });

        describe('getShipToCountries', function () {

            it('should correctly return the ship to countries', function() {
                expect(shippingSvc.getShipToCountries([{shipTo: ['US', 'MX']}, {shipTo: ['CA']}])).toEqual([ 'US', 'MX', 'CA' ]);
            });

        })

        describe('getMinimumShippingCost', function () {

            it('should correctly return minimum shipping cost', function() {
                var shippingCosts = [{methods:[{fee: {amount:8.6,currency:'USD'},id:'fedex-2dayground',name:'FedEx 2Day'},{fee: {amount:8.76,currency:'USD'},id:'ups-standard',name:'UPS Standard'}],
                    zone: {id:'us',name:'USA'}}];
                expect(shippingSvc.getMinimumShippingCost(shippingCosts)).toEqual({fee:{ amount:8.6,currency:'USD'},id:'fedex-2dayground',name:'FedEx 2Day',zoneId:'us'});
            });

        })

    });

});