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
describe('ShippingSvc', function() {
	
	var $scope, $rootScope, shippingSvc, mockedGlobalData;

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
	}

	mockedGlobalData = {
        user: {
            isAuthenticated: '',
            user: null
        },
        getSiteCode: jasmine.createSpy().andReturn('US'),
        getCurrencyId: jasmine.createSpy().andReturn('USD')
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

	        inject(function (_$httpBackend_, _$rootScope_, _ShippingSvc_, _$q_, SiteConfigSvc) {
	            $rootScope = _$rootScope_;
	            $scope = _$rootScope_.$new();
	            $httpBackend = _$httpBackend_;
	            shippingSvc = _ShippingSvc_;
	            siteConfig = SiteConfigSvc;
	            siteConfig.apis.shippingZones.baseUrl + 'shipping';
	            $q = _$q_;
	        });

	        $httpBackend.whenGET(/^[A-Za-z-/]*\.html/).respond({});
	        
	        
	    });

	    it('should issue POST', function () {
	    	$httpBackend.expectPOST('https://api.yaas.io/hybris/shipping/v1/US/quote').respond({});
            shippingSvc.getShippingCosts(item);
            $httpBackend.flush();
        });

	    it('should issue POST', function () {
	    	$httpBackend.expectPOST('https://api.yaas.io/hybris/shipping/v1/US/quote/minimum').respond({});
            shippingSvc.getMinimumShippingCost(item);
            $httpBackend.flush();
        });

    });

});