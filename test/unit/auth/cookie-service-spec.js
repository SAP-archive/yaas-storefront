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

describe('CookieSvc', function () {

    var CookieSvc, ipCookie;
    var langCookieName = 'languageCookie';

    var mockedSettings = {
        languageCookie: langCookieName
    };

    beforeEach(function() {
        module('ipCookie');
    });

    // MOCK SETTINGS OVERRIDE NOT WORKING PROPERLY
    beforeEach(module('ds.shared', function($provide) {
        $provide.constant('settings', mockedSettings);

    }));

    beforeEach(inject(function(_CookieSvc_, _ipCookie_) {
        CookieSvc = _CookieSvc_;
        ipCookie = _ipCookie_;
    }));

    beforeEach(function(){
        ipCookie.remove(langCookieName);
        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });

    });

    describe('languageCookie', function(){
        it('should get the correct cookie', function(){
            var oldLang = 'en';
            CookieSvc.setLanguageCookie(oldLang);
            expect(CookieSvc.getLanguageCookie().languageCode).toEqualData(oldLang);
        });

        it('should set the cookie value', function(){
            var lang = 'de';
            var oldLang = 'en';
            ipCookie(langCookieName, oldLang);
            CookieSvc.setLanguageCookie(lang);
            expect(ipCookie(langCookieName).languageCode).toEqualData(lang);
        });
    });

});
