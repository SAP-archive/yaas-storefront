/**
 * [y] hybris Platform
 *
 * Copyright (c) 2000-2015 hybris AG
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

        var LanguageCookie = function(languageCode) {
            this.languageCode = languageCode;
            this.getLanguageCode = function () {
                return this.languageCode;
            };
        };

        var SiteCookie = function (site) {
            this.site = site;
            this.getSite = function () {
                return this.site;
            };
        };

        var ConsentReferenceCookie = function(consentReference) {
            this.consentReference = consentReference;
            this.getConsentReference = function () {
                return this.consentReference;
            };
        };

        var CookieSvc = {

            setLanguageCookie: function (languageCode, expiresIn) {
                ipCookie.remove(settings.languageCookie);
                var languageCookie = new LanguageCookie(languageCode);
                ipCookie(settings.languageCookie, JSON.stringify(languageCookie), {expirationUnit: 'seconds', expires: expiresIn ? expiresIn : defaultExpirySeconds});
            },

            getLanguageCookie: function () {
                var languageCookie = ipCookie(settings.languageCookie);
                return languageCookie ? new LanguageCookie(languageCookie.languageCode) : false;
            },

            setSiteCookie: function (site, expiresIn) {
                ipCookie.remove(settings.siteCookie);
                var siteCookie = new SiteCookie(site);
                ipCookie(settings.siteCookie, JSON.stringify(siteCookie), { expirationUnit: 'seconds', expires: expiresIn ? expiresIn : defaultExpirySeconds });
            },

            getSiteCookie: function () {
                var siteCookie = ipCookie(settings.siteCookie);
                if (siteCookie) {
                    return siteCookie.site;
                }
                return siteCookie;
            },

            setConsentReferenceCookie: function(consentReference, expiresIn) {
                ipCookie.remove(settings.consentReferenceCookie);
                var consentReferenceCookie = new ConsentReferenceCookie(consentReference);
                ipCookie(settings.consentReferenceCookie, JSON.stringify(consentReferenceCookie), { expirationUnit: 'seconds', expires: expiresIn ? expiresIn : defaultExpirySeconds });
            },

            getConsentReferenceCookie: function() {
                var consentReferenceCookie = ipCookie(settings.consentReferenceCookie);
                if (consentReferenceCookie) {
                    return consentReferenceCookie.consentReference;
                }
                return consentReferenceCookie;
            }

        };

        return CookieSvc;

    }]);