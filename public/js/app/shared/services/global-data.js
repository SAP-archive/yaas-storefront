'use strict';

angular.module('ds.shared')
/** Acts as global data store for application settings. In contrast to the "settings" constant provider,
 * these settings may change over the life of the application.
 *
 * Also provides some logic around updating these settings.
 * */
    .factory('GlobalData', ['storeConfig', '$translate', 'CookieSvc', '$rootScope',
        function (storeConfig, $translate, CookieSvc, $rootScope) {

            var languageCode = 'en';
            var acceptLanguages = languageCode;
            var storeDefaultCurrency;
            var activeCurrencyId = 'USD';
            var currencyMap = [];
            var availableCurrencies = [];
            var languageMap = [];
            var availableLanguages = [];
            function setCurrencyWithOptionalCookie(currencyId, setCookie, fromLogin) {
                if(currencyId && currencyId in currencyMap ) {
                    if( currencyId!==activeCurrencyId){
                        activeCurrencyId =  currencyId;
                        $rootScope.$emit('currency:updated',  currencyId, fromLogin);
                    }
                    if(setCookie){
                        CookieSvc.setCurrencyCookie(currencyId);
                    }
                } else {
                    console.warn('Currency not valid: '+currencyId);
                }
            }

            function setLanguageWithOptionalCookie(newLangCode, setCookie, fromLogin){
                if(newLangCode && newLangCode in languageMap) {
                    if (languageCode !== newLangCode) {
                        languageCode = newLangCode;
                        $translate.use(languageCode);
                        acceptLanguages = (languageCode === storeConfig.defaultLanguage ? languageCode : languageCode + ';q=1,' + storeConfig.defaultLanguage + ';q=0.5');
                        $rootScope.$emit('language:updated',  languageCode, fromLogin);
                    }
                    if(setCookie) {
                        CookieSvc.setLanguageCookie(languageCode);
                    }
                } else {
                    console.warn('Language not valid: '+newLangCode);
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
                setLanguage: function (newLangCode, fromLogin) {
                    setLanguageWithOptionalCookie(newLangCode, true, fromLogin);
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
                        setLanguageWithOptionalCookie(languageCookie.languageCode, false);
                    } else {
                        setLanguageWithOptionalCookie(storeDefaultCurrency, true);
                    }
                },


                /** Sets the currency id that's supposed to be active for this store and stores it to a
                 * cookie.
                 * If the id is not part of the "available" currencies, the update will be silently rejected.
                 * @param object with property id === currency id; if property setCookie === true, setting will
                 * be written to cookie (if valid)*/
                setCurrency: function (currency, fromLogin) {
                   setCurrencyWithOptionalCookie(currency, true, fromLogin);
                },

                /** Determines the initial active currency for the store, based on store configuration and
                 * any existing cookie settings. */
                loadInitialCurrency: function(){
                    var currencyCookie = CookieSvc.getCurrencyCookie();
                    if(currencyCookie && currencyCookie.currency){
                        setCurrencyWithOptionalCookie(currencyCookie.currency, false);
                    } else {
                        setCurrencyWithOptionalCookie(storeDefaultCurrency, true);
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
                                languageCode = language.id;
                            }
                        });
                    }
                },

                /** Returns an array of language instances supported by this project.*/
                getAvailableLanguages: function(){
                    return availableLanguages;
                }



            };

        }]);
