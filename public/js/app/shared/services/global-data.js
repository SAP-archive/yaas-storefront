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
    .factory('GlobalData', ['storeConfig', '$translate', 'CookieSvc', '$rootScope', 'i18nConstants', 'translateSettings', 'settings',
        function (storeConfig, $translate, CookieSvc, $rootScope, i18nConstants, translateSettings, settings) {

            var languageCode;
            var defaultLang;
            var languageMap = {};
            var availableLanguages = {};
            // HTTP accept-languages header setting for service calls
            var acceptLanguages;

            var storeDefaultCurrency;
            var activeCurrencyId;
            var currencyMap = {};
            var availableCurrencies = {};


            // for label translation, we're limited to what we're providing in localization settings in i18
            function setTranslateLanguage(langCode){
                if(settings.translateLanguages.indexOf(langCode)>-1){
                    $translate.use(langCode);
                } else if (translateSettings.supportedLanguages.indexOf(defaultLang) > -1){
                    $translate.use(defaultLang);
                } else {
                    $translate.use(translateSettings.defaultLanguageCode);
                }
            }

            function setCurrencyWithOptionalCookie(currencyId, setCookie, updateSource) {
                if(! _.isEmpty(currencyMap)) {
                    if (currencyId && currencyId in currencyMap) {
                        if (setCookie) {
                            CookieSvc.setCurrencyCookie(currencyId);
                        }
                        if (currencyId !== activeCurrencyId) {
                            activeCurrencyId = currencyId;

                            if (updateSource !== settings.eventSource.initialization) {  // don't event on initialization
                                $rootScope.$emit('currency:updated', {
                                    currencyId: activeCurrencyId,
                                    source: updateSource
                                });
                            }
                        }
                    } else {
                        console.warn('Currency not valid: ' + currencyId + '. Using default currency ' + storeDefaultCurrency);
                        setCurrencyWithOptionalCookie(storeDefaultCurrency, true, updateSource);
                    }
                }
            }

            function setLanguageWithOptionalCookie(newLangCode, setCookie, updateSource){
                if(!_.isEmpty(languageMap)) {
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
                        if(defaultLang && defaultLang in languageMap){
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
                        total: 0
                    }
                },
                addresses:  {
                    meta: {
                        total: 0
                    }
                },

                store: {
                    tenant: storeConfig.storeTenant,
                    name: '',
                    logo: null
                },

                user: {
                    isAuthenticated: false,
                    username: null
                },

                /** Returns the currency symbol of the active currency.*/
                getCurrencySymbol: function (optionalId) {
                    var id = optionalId || activeCurrencyId;
                    var symbol = '?';
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
                    setLanguageWithOptionalCookie(newLangCode, true, updateSource ? updateSource: settings.eventSource.unknown);
                },


                /** Returns the language code that's currently active for the store.*/
                getLanguageCode: function(){
                    return languageCode;
                },

                /** Returns the active language instance.*/
                getLanguage: function(){
                    return languageMap[languageCode];
                },

                /** Returns the 'accept-languages' header for the application.*/
                getAcceptLanguages: function(){
                  return acceptLanguages;
                },


                /** Determines the initial active language for the store, based on store configuration and
                 * any existing cookie settings. */
                loadInitialLanguage: function(){
                    var languageCookie = CookieSvc.getLanguageCookie();
                    if(languageCookie && languageCookie.languageCode){
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
                setCurrency: function (currency, updateSource) {
                   setCurrencyWithOptionalCookie(currency, true, updateSource ? updateSource: settings.eventSource.unknown);
                },

                /** Determines the initial active currency for the store, based on store configuration and
                 * any existing cookie settings. */
                loadInitialCurrency: function(){
                    var currencyCookie = CookieSvc.getCurrencyCookie();
                    if(currencyCookie && currencyCookie.currency){
                        setCurrencyWithOptionalCookie(currencyCookie.currency, false, settings.eventSource.initialization);
                    } else {
                        setCurrencyWithOptionalCookie(storeDefaultCurrency, true, settings.eventSource.initialization);
                    }
                },

                /** Returns the id of the currency that's currently active for the store.*/
                getCurrencyId: function(){
                    return activeCurrencyId;
                },

                /** Returns the currency instance for a given currency id.*/
                getCurrencyById: function(currId){
                    return currencyMap[currId];
                },

                /** Returns the active currency instance.*/
                getCurrency: function(){
                    return this.getCurrencyById(activeCurrencyId);
                },

                /** Sets an array of currency instances from which a shopper should be able to choose.*/
                setAvailableCurrencies: function(currencies){
                    if(currencies) {
                        availableCurrencies = currencies;
                        angular.forEach(currencies, function (currency) {
                            currencyMap[currency.id] = currency;
                            if (currency.default) {
                                storeDefaultCurrency = currency.id;
                            }
                        });
                    }
                    if(!storeDefaultCurrency){
                        console.error('No default currency defined!');
                    }
                },

                /** Returns an array of currency instances supported by this project.*/
                getAvailableCurrencies: function(){
                    return availableCurrencies;
                },

                /** Sets an array of language instances from which a shopper should be able to choose.*/
                setAvailableLanguages: function(languages){
                    if(languages) {
                        availableLanguages = languages;
                        angular.forEach(languages, function (language) {
                            languageMap[language.id] = language;
                            if (language.default) {
                                defaultLang = language.id;
                                languageCode = defaultLang;
                                acceptLanguages = defaultLang;
                            }
                        });
                    }
                    if(!defaultLang){
                        console.error('No default language has been defined!');
                    }
                },

                /** Returns an array of language instances supported by this project.*/
                getAvailableLanguages: function(){
                    return availableLanguages;
                }



            };

        }]);
