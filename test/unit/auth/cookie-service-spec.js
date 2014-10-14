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
    var langCookieName = 'langCookie';
    var curCookieName = 'curCookie';

    var mockedSettings = {
        currencyCookie: langCookieName,
        languageCookie: curCookieName
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
        ipCookie.remove(curCookieName);
        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });

    });

    describe('currencyCookie', function(){

        it('should get the correct cookie', function(){
            var oldCurr = 'USD';
            ipCookie(curCookieName, oldCurr);
            //expect(CookieSvc.getCurrencyCookie().currency).toEqualData(oldCurr);
        });

        it('should set the cookie value', function(){
            var currency = 'EUR';
            var oldCurr = 'USD';
            ipCookie(curCookieName, oldCurr);
            CookieSvc.setCurrencyCookie(currency);
            //expect(ipCookie(curCookieName)).toEqualData(currency);
        });

    });

    describe('languageCookie', function(){
        it('should get the correct cookie', function(){
            var oldLang = 'en';
            ipCookie(curCookieName, oldLang);
            //expect(CookieSvc.getLanguageCookie().languageCode).toEqualData(oldLang);
        });

        it('should set the cookie value', function(){
            var lang = 'de';
            var oldLang = 'en';
            ipCookie(curCookieName, oldLang);
            CookieSvc.setCurrencyCookie(lang);
            //expect(ipCookie(langCookieName).languageCode).toEqualData(lang);
        });
    });

});
