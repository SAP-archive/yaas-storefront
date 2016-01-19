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

describe('LocalizedAddresses Test', function () {
    var scope, $compile, $rootScope, mockBackend, mockGlobalData, mockShippingSvc;
    module('ds.checkout');

    mockGlobalData = {
        getSite: jasmine.createSpy().andReturn({code: 'us'})
    };

    mockShippingSvc = {
        getShipToCountries: function () {return true;}
    };

    beforeEach(module('ds.addresses', function ($provide) {
        $provide.value('GlobalData', mockGlobalData);
        $provide.value('ShippingSvc', mockShippingSvc);
    }));

    beforeEach(inject(function(_$compile_, _$rootScope_, _$httpBackend_){
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        scope = _$rootScope_.$new();
        mockBackend = _$httpBackend_;
    }));

  it('Replaces the element with content', function() {

    var template = '<div>Example Address Form</div>';
    scope.localeSelection = {id:'US'};
    scope.order = {

    };
    scope.changeLocale = jasmine.createSpy();
    scope.initializeLocale = jasmine.createSpy();
    $rootScope.updateShippingCost = jasmine.createSpy();
    mockGlobalData.getAllCountries = jasmine.createSpy();
    mockBackend.expectGET('js/app/addresses/templates/addAddressDefault.html').respond(template);
    var element = $compile("<localized-addresses type='addAddress'></localized-addresses>")($rootScope);
    $rootScope.$digest();
    expect(element.html()).toContain("");
  });

});
