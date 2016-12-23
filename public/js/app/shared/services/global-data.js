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

angular.module('ds.shared')
/** Acts as global data store for application settings. In contrast to the "settings" constant provider,
 * these settings may change over the life of the application.
 *
 * Also provides some logic around updating these settings.
 * */
    .factory('GlobalData', ['appConfig', '$translate', 'CookieSvc', '$rootScope', 'translateSettings', 'settings', '$location',
        function (appConfig, $translate, CookieSvc, $rootScope, translateSettings, settings, $location) {

            var sites, currentSite;

            var languageCode;
            var defaultLang = 'en';
            var languageMap = {};
            var availableLanguages = {};
            // HTTP accept-languages header setting for service calls
            var acceptLanguages;

            var storeDefaultCurrency;
            var activeCurrencyId;
            var availableCurrency = {};
            var siteMixinsMap = {};


            // for label translation, we're limited to what we're providing in localization settings in i18
            function setTranslateLanguage(langCode) {
                if (settings.translateLanguages.indexOf(langCode) > -1) {
                    $translate.use(langCode);
                } else if (translateSettings.supportedLanguages.indexOf(defaultLang) > -1) {
                    $translate.use(defaultLang);
                } else {
                    $translate.use(translateSettings.defaultLanguageCode);
                }
            }

            /**
            * Used for getting the language object from language id.
            */
            function getLanguageById(id) {
                switch (id) {
                    case 'en':
                        return { id: id, label: 'English' };
                    case 'de':
                        return { id: id, label: 'German' };
                    default:
                        return { id: id, label: id };
                }
            }

            function setLanguageWithOptionalCookie(newLangCode, setCookie, updateSource) {
                if (!_.isEmpty(languageMap)) {
                    if (newLangCode && newLangCode in languageMap) {

                        if (setCookie) {
                            CookieSvc.setLanguageCookie(newLangCode);
                        }

                        if (languageCode !== newLangCode) {
                            languageCode = newLangCode;
                            acceptLanguages = (languageCode === defaultLang ? languageCode : languageCode + ';q=1,' + defaultLang + ';q=0.5');
                            if (updateSource !== settings.eventSource.initialization) { // don't event on initialization
                                $rootScope.$emit('language:updated', {
                                    languageCode: languageCode,
                                    source: updateSource
                                });
                            }
                        }
                        setTranslateLanguage(languageCode);
                    } else {
                        console.warn('Language not valid: ' + newLangCode);
                        if (defaultLang && defaultLang in languageMap) {
                            console.log('Using default language instead: ' + defaultLang);
                            setLanguageWithOptionalCookie(defaultLang, setCookie, updateSource);
                        } else {
                            console.error('No default language defined.');
                        }
                    }
                }
            }

            return {
                orders: {
                    meta: {
                        total: 0
                    }
                },
                products: {
                    meta: {
                        total: ''
                    },
                    pageSize: 8,
                    lastSort: '',
                    lastViewedProductId: ''
                },
                addresses: {
                    meta: {
                        total: 0
                    }
                },

                store: {
                    tenant: appConfig.storeTenant(),
                    clientId: appConfig.clientId(),
                    redirectURI: appConfig.redirectURI(),
                    name: '',
                    logo: null,
                    icon: null
                },

                user: {
                    isAuthenticated: false,
                    username: null
                },

                search: {
                    algoliaKey: '',
                    algoliaProject: 'MSSYUK0R36'
                },

                /**
                 * Function that is returning channel for cart
                 */
                getChannel: function getChannel() {
                    return {
                        name: 'yaas-storefront',
                        source: $location.host()
                    };
                },

                /** Returns the currency symbol of the active currency.*/
                getCurrencySymbol: function (optionalId) {
                    var id = optionalId || activeCurrencyId;
                    var symbol = id || '?';
                    if (id === 'USD' || id === 'CAD') {
                        symbol = '$';
                    }
                    else if (id === 'EUR') {
                        symbol = '\u20AC';
                    }
                    else if (id === 'GBP') {
                        symbol = '\u20A4';
                    }
                    else if (id === 'JPY' || id === 'CNY') {
                        symbol = '\u00A5';
                    }
                    else if (id === 'PLN') {
                        symbol = '\u007A' + '\u0142';
                    }
                    else if (id === 'CHF') {
                        symbol = 'CHF';
                    }

                    return symbol;
                },

                /** Sets the code of the language that's supposed to be active for the store.*/
                setLanguage: function (newLangCode, updateSource) {
                    setLanguageWithOptionalCookie(newLangCode, true, updateSource ? updateSource : settings.eventSource.unknown);
                },

                /** Returns the language code that's currently active for the store.*/
                getLanguageCode: function () {
                    return languageCode;
                },

                /** Returns the active language instance.*/
                getLanguage: function () {
                    return languageMap[languageCode];
                },

                /** Returns the 'accept-languages' header for the application.*/
                getAcceptLanguages: function () {
                    return acceptLanguages;
                },

                /** Determines the initial active language for the store, based on store configuration and
                 * any existing cookie settings. */
                loadInitialLanguage: function () {
                    var languageCookie = CookieSvc.getLanguageCookie();
                    if (languageCookie && languageCookie.languageCode) {
                        setLanguageWithOptionalCookie(languageCookie.languageCode, false, settings.eventSource.initialization);
                    } else {
                        setLanguageWithOptionalCookie(languageCode, true, settings.eventSource.initialization);
                    }
                },

                /** Sets the currency id that's supposed to be active for this store and stores it to a
                 * cookie.
                 * If the id is not part of the "available" currencies, the update will be silently rejected.
                 * @param object with property id === currency id; if property setCookie === true, setting will
                 * be written to cookie (if valid)*/
                setCurrency: function (currency) {
                    if (currency !== activeCurrencyId) {
                        activeCurrencyId = currency;
                    }
                },

                /** Determines the initial active site for the store, based on store configuration and
                * any existing cookie settings. */
                loadInitialSite: function () {
                    var siteCookie = CookieSvc.getSiteCookie();
                    return siteCookie;
                },

                /** Returns the id of the currency that's currently active for the store.*/
                getCurrencyId: function () {
                    return activeCurrencyId;
                },

                /** Returns the active currency instance.*/
                getCurrency: function () {
                    return activeCurrencyId;
                },

                /** Sets an array of currency instances from which a shopper should be able to choose.*/
                setAvailableCurrency: function (currency) {

                    if (currency) {
                        availableCurrency = currency;
                        storeDefaultCurrency = currency;
                    }
                    if (!storeDefaultCurrency) {
                        console.error('No default currency defined!');
                    }
                },

                /** Returns an array of currency instances supported by this project.*/
                getAvailableCurrency: function () {
                    return availableCurrency;
                },

                /** Sets an array of language instances from which a shopper should be able to choose.*/
                setAvailableLanguages: function (languages) {
                    if (languages) {
                        availableLanguages = [];

                        angular.forEach(languages, function (language) {
                            languageMap[language.id] = language;

                            availableLanguages.push(language);
                        });
                    }
                    if (!defaultLang) {
                        console.error('No default language has been defined!');
                    }
                },

                setDefaultLanguage: function (lang) {
                    defaultLang = lang.id;
                },

                /** Returns an array of language instances supported by this project.*/
                getAvailableLanguages: function () {
                    return availableLanguages;
                },

                setSiteCookie: function (site) {
                    var cookieSite = { code: site.code };
                    CookieSvc.setSiteCookie(cookieSite);
                },

                setSiteMixins: function (mixins) {
                    if(angular.isObject(mixins)){
                        // For each mixin, populate the site mixin map
                        for(var mixin in mixins) {
                            siteMixinsMap[mixin] = mixins[mixin];
                        }
                    }
                },

                deleteSiteMixins: function() {
                    siteMixinsMap = {};
                },

                getSiteMixins: function() {
                  return siteMixinsMap;
                },

                setSite: function (site, selectedLanguageCode) {

                    if (!currentSite || currentSite.code !== site.code) {

                        //Set current site
                        currentSite = site;

                        //Set name of store
                        this.store.name = site.name;
                        $rootScope.titleConfig = site.name;

                        //Set stripe key if defined
                        if (!!site.payment && site.payment.length > 0 && !!site.payment[0].configuration && !!site.payment[0].configuration.public && !!site.payment[0].configuration.public.publicKey) {
                            /* jshint ignore:start */
                            Stripe.setPublishableKey(site.payment[0].configuration.public.publicKey);
                            /* jshint ignore:end */
                        }

                        //Set main image
                        if (!!site.mixins && !!site.mixins.storeLogoImageKey &&
                            !!site.mixins.storeLogoImageKey.value) {
                            this.store.logo = site.mixins.storeLogoImageKey.value;
                        }
                        else {
                            //Delete this property and make store fallback to default
                            delete this.store.logo;
                        }

                        //Set site icon
                        if (!!site.mixins && !!site.mixins.storeIconImageKey &&
                            !!site.mixins.storeIconImageKey.value) {
                            this.store.icon = site.mixins.storeIconImageKey.value;
                        }
                        else {
                            //Delete this property and make store fallback to default
                            delete this.store.icon;
                        }

                        //Create array
                        if (site.currency) {
                            if (site.currency !== this.getCurrencyId()) {
                                this.setAvailableCurrency(site.currency);
                                this.setCurrency(site.currency);
                            }
                        }

                        //Set languages
                        var languages = [];
                        if (!!site.languages) {
                            for (var i = 0; i < site.languages.length; i++) {
                                languages.push(getLanguageById(site.languages[i]));
                            }
                        }
                        this.setAvailableLanguages(languages);

                        //Set default language
                        if (selectedLanguageCode) {
                            setLanguageWithOptionalCookie(selectedLanguageCode, true, settings.eventSource.siteUpdate);
                        }

                        //Set site mixins
                        if(site.mixins) {
                            this.setSiteMixins(site.mixins);
                        }
                        else {
                            //The site does not have mixins
                            // If the siteMixinsMap was already populated by a previous site selection, we need to empty it
                            if(Object.keys(this.getSiteMixins()).length > 0){
                                this.deleteSiteMixins();
                            }
                        }

                        //Emit site change for cart
                        $rootScope.$broadcast('site:updated');
                    }
                },

                setSites: function (Sites) {
                    var storefrontSites = [];
                    for (var i = 0; i < Sites.length; i++) {
                        storefrontSites.push(Sites[i]);
                    }
                    sites = storefrontSites;
                },

                getSite: function () {
                    if (!!currentSite) {
                        return currentSite;
                    }
                    else {
                        return CookieSvc.getSiteCookie();
                    }
                },

                getSiteCode: function () {
                    if (!!currentSite) {
                        return currentSite.code;
                    }
                    return 'default';
                },

                getSites: function () {
                    return sites;
                },

                getTaxType: function () {
                    if (!!currentSite && !!currentSite.tax && !!currentSite.tax[0]) {
                        return currentSite.tax[0].id;
                    }
                    return null;
                },

                getCurrentTaxConfiguration: function () {
                    if (!!currentSite && !!currentSite.tax && !!currentSite.tax[0] && currentSite.tax[0].id === 'FLATRATE' && !!currentSite.tax[0].configuration) {
                        return currentSite.tax[0].configuration.public;
                    }
                    else {
                        return null;
                    }
                },

                getSiteBanners: function () {
                    if (!!currentSite && !!currentSite.mixins) {
                        return currentSite.mixins.siteContentDetails;
                    }
                    return null;
                },

                getEmailRegEx: function () {
                    return (/^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i);

                },

                getUserTitles: function () {
                    return ['', 'MR', 'MS', 'MRS', 'DR'];
                },

                getProductRefinements: function () {
                    return [{id: 'name.' + $translate.use(), name: 'A-Z'}, {id: 'name.' + $translate.use()+':desc', name: 'Z-A'}, {id: 'metadata.createdAt:desc', name: $translate.instant('NEWEST')}];
                },

                getSearchRefinements: function () {
                    return [{id:'mostRelevant', name: $translate.instant('MOST_RELEVANT')}];
                },

                getTaxableCountries: function () {
                    return [{id:'US', name: 'USA'}, {id:'CA', name: 'CANADA'}];
                }

            };

        }]);
