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
    var $compile, $rootScope, mockBackend;

    beforeEach(module('ds.addresses', function ($provide) {
    }));

    beforeEach(inject(function(_$compile_, _$rootScope_, _$httpBackend_){
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        mockBackend = _$httpBackend_;
    }));

  it('Replaces the element with content', function() {

    var template = '<div>Example Address Form</div>';
    mockBackend.expectGET('js/app/addresses/templates/addAddressUS.html').respond(template);

    var element = $compile("<localized-addresses type='addAddress'></localized-addresses>")($rootScope);
    $rootScope.$digest();
    expect(element.html()).toContain("");
  });

});
