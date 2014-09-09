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

describe('TokenSvc', function () {

    var TokenSvc, mockedCookies, mockedSettings;

    mockedSettings = {
        accessCookie: 'accessCookie',
        userIdKey: 'userIdKey',
        authTokenKey: 'authTokenKey'
    };

    beforeEach(function() {
        module('ipCookie');
    });

    beforeEach(module('ds.auth', function($provide) {
        $provide.value('settings', mockedSettings);
    }));

    beforeEach(inject(function(_TokenSvc_) {
        TokenSvc = _TokenSvc_;
    }));

    it('should expose correct interface', function () {
        expect(TokenSvc.unsetToken).toBeDefined();
        expect(TokenSvc.setToken).toBeDefined();
        expect(TokenSvc.getToken).toBeDefined();
    });

    it("should decorate returned token object with 2 accessor(extractor) methods", function() {
        var token = TokenSvc.getToken();

        expect(token.getUsername).toBeDefined();
        expect(token.getAccessToken).toBeDefined();
        expect(token.getUsername()).toBeFalsy();
        expect(token.getAccessToken()).toBeFalsy();

        var value = 123;
        TokenSvc.setToken(value, value);
        token = TokenSvc.getToken();

        expect(token.getUsername()).toBeDefined();
        expect(token.getUsername()).toEqual(value);
        expect(token.getAccessToken()).toBeDefined();
        expect(token.getAccessToken()).toEqual(value);
    });

});
