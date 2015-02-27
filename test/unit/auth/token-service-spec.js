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

    var TokenSvc, mockedSettings, ipCookie;
    var cookieName = 'accessCookie';
    var user = '123';
    var access = 'abc';
    var tenant = 'tenant';
    var appConfig = {
        storeTenant: function() { return 'tenant'; },
        dynamicDomain: function() {return 'dynDomain'}
    };

    mockedSettings = {
        accessCookie: cookieName
    };

    beforeEach(function() {
        module('ipCookie');
    });

    beforeEach(module('ds.auth', function($provide) {
        $provide.value('settings', mockedSettings);
        $provide.value('appConfig', appConfig);
    }));

    beforeEach(inject(function(_TokenSvc_, _ipCookie_) {
        TokenSvc = _TokenSvc_;
        //console.log(_ipCookie_);
        ipCookie = _ipCookie_;
        //console.log(ipCookie);
    }));

    it('should expose correct interface', function () {
        expect(TokenSvc.unsetToken).toBeDefined();
        expect(TokenSvc.setToken).toBeDefined();
        expect(TokenSvc.getToken).toBeDefined();
    });

    beforeEach(function(){
        ipCookie.remove(cookieName);
        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });
    });

    describe('setToken()', function(){
        it('should set the cookie', function(){
            TokenSvc.setToken(access, null);
            var cookie = ipCookie(cookieName);
            expect(cookie).toBeTruthy();
        });
    });

    describe('getToken()', function(){

        it('should return a token object with empty name and access token if cookie not set', function(){
            var token = TokenSvc.getToken();

            expect(token.getUsername).toBeDefined();
            expect(token.getAccessToken).toBeDefined();
            expect(token.getUsername()).toBeFalsy();
            expect(token.getAccessToken()).toBeFalsy();
        });

        it('should return a token object with user name and access token if cookie set', function() {

            TokenSvc.setToken(access, user);
            var token = TokenSvc.getToken();

            expect(token.getUsername()).toBeDefined();
            expect(token.getUsername()).toEqual(user);
            expect(token.getAccessToken()).toBeDefined();
            expect(token.getAccessToken()).toEqual(access);
        });
    });

    describe('unsetToken()', function(){
        it('should remove the cookie', function(){
            ipCookie(cookieName, {accessToken: 'abc'});
            TokenSvc.unsetToken();
            expect(ipCookie(cookieName)).toBeFalsy();
        });
    });

    describe('setAnonymousToken', function(){
        it('should replace the token if it exists for different tenant', function(){
            var authenticatedToken = '567';
            ipCookie(cookieName, {accessToken: authenticatedToken, tenant: 'oldTenant'});
            var newToken = '432';
            TokenSvc.setAnonymousToken(newToken, 999);
            expect(ipCookie(cookieName).accessToken).toEqualData(newToken);
        });

        it('should not replace the token if it exists for same tenant', function(){
            var authenticatedToken = '567';
            ipCookie(cookieName, {accessToken: authenticatedToken, tenant: tenant});
            TokenSvc.setAnonymousToken('432', 999);
            expect(ipCookie(cookieName).accessToken).toEqualData(authenticatedToken);
        });

        it('should set the token if none exists', function(){

            var anonNew = '432';
            TokenSvc.setAnonymousToken(anonNew, 999);
            expect(ipCookie(cookieName).accessToken).toEqualData(anonNew);
        });
    });

});
