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

describe('CartNoteMixinSvc Test', function() {

    var mockedCartSvc, mockedCartItem, mockedNoteContent, cartUrl;

    beforeEach(function() {
        
        // Mock GlobalData
        mockedGlobalData = {
            getTaxType: jasmine.createSpy('getTaxType').andReturn('AVALARA'),
            getCurrencyId: jasmine.createSpy('getCurrencyId').andReturn('USD'),
            getAcceptLanguages: jasmine.createSpy('getAcceptLanguages').andReturn('en'),
            getSiteCode: jasmine.createSpy('getSiteCode').andReturn('europe123')
        };
        
        mockedCartSvc = {
            refreshCart: jasmine.createSpy('refreshCart').andReturn({}),
            getLocalCart: jasmine.createSpy('refreshCart').andReturn({id: "123"})
        };
        
        module('restangular');
        module('ds.products');
        module('ds.cart', function($provide) {
            $provide.value('CartSvc', mockedCartSvc);
            $provide.value('GlobalData', mockedGlobalData);
            $provide.value('appConfig', {});
        });
    });

    beforeEach(inject(function(_$httpBackend_, CartNoteMixinSvc, SiteConfigSvc) {
        mockedBackend = _$httpBackend_;
        cartNoteMixinSvc = CartNoteMixinSvc;
        siteConfig = SiteConfigSvc;
        
        cartUrl = siteConfig.apis.cart.baseUrl + 'carts';

        mockedCartItem = {
            id: '123'
        };
        mockedNoteContent = "A mocked note";
    }));


    it('should persist the note', function() {
        var cartUrlRegex = new RegExp(cartUrl);
        mockedBackend.expectPUT(cartUrlRegex).respond(200, {});
        
        cartNoteMixinSvc.updateNote(mockedCartItem, mockedNoteContent);
        mockedBackend.flush();
    });
});
