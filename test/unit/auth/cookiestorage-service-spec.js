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

describe('CookiesStorage Test', function () {

    var CookiesStorage, $mockedCookies, mockedSettings;
    $mockedCookies = {};
    mockedSettings = {
        accessTokenKey: 'accessTokenKey',
        userIdKey: 'userIdKey',
        authTokenKey: 'authTokenKey'
    };

    beforeEach(function() {
        module('ngCookies');
    });

    beforeEach(module('ds.auth', function($provide) {
        $provide.value('$cookies', $mockedCookies);
        $provide.value('settings', mockedSettings);
    }));

    beforeEach(inject(function(_CookiesStorage_) {
        CookiesStorage = _CookiesStorage_;
    }));

    it('should expose correct interface', function () {
        expect(CookiesStorage.unsetToken).toBeDefined();
        expect(CookiesStorage.setToken).toBeDefined();
        expect(CookiesStorage.getToken).toBeDefined();
    });

    it("should decorate returned token object with 2 accessor(extractor) methods", function() {
        var token = CookiesStorage.getToken();
        expect(token.getUsername).toBeDefined();
        expect(token.getAccessToken).toBeDefined();
        expect(token.getUsername()).not.toBeDefined();
        expect(token.getAccessToken()).not.toBeDefined();

        var value = 123;
        CookiesStorage.setToken(value, value);
        token = CookiesStorage.getToken();
        expect(token.getUsername()).toBeDefined();
        expect(token.getUsername()).toEqual(value);
        expect(token.getAccessToken()).toBeDefined();
        expect(token.getAccessToken()).toEqual(value);
    });

});
