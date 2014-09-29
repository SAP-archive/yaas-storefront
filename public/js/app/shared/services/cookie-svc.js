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

'use strict';

/**
 *  Encapsulates management of the OAuth token and user name, using cookies.
 */
angular.module('ds.shared')
    .factory('CookieSvc', ['settings', 'ipCookie', function(settings, ipCookie){

        var defaultExpirySeconds = 100000;

        var CurrencyCookie = function(currency) {
            this.currency = currency;
            this.getCurrency = function () {
                return this.currency;
            };
        };

        var LanguageCookie = function(languageCode) {
            this.languageCode = languageCode;
            this.getLanguageCode = function () {
                return this.languageCode;
            };
        };


        var CookieSvc = {

            setCurrencyCookie: function(currency, expiresIn) {
                ipCookie.remove(settings.currencyCookie);
                var currencyCookie = new CurrencyCookie(currency);
                ipCookie(settings.currencyCookie, JSON.stringify(currencyCookie), {expirationUnit: 'seconds', expires: expiresIn ? expiresIn : defaultExpirySeconds});
            },

            getCurrencyCookie: function () {
                var currencyCookie = ipCookie(settings.currencyCookie);
                return currencyCookie ? new CurrencyCookie(currencyCookie.currency) : false;
            },

            setLanguageCookie: function(languageCode, expiresIn) {
                ipCookie.remove(settings.languageCookie);
                var languageCookie = new LanguageCookie(languageCode);
                ipCookie(settings.languageCookie, JSON.stringify(languageCookie), {expirationUnit: 'seconds', expires: expiresIn ? expiresIn : defaultExpirySeconds});
            },

            getLanguageCookie: function () {
                var languageCookie = ipCookie(settings.languageCookie);
                return languageCookie ? new LanguageCookie(languageCookie.languageCode) : false;
            }

        };

        return CookieSvc;

    }]);