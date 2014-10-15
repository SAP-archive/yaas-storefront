'use strict';

angular.module('ds.shared')
/** Acts as global data store for application settings. In contrast to the "settings" constant provider,
 * these settings may change over the life of the application.
 *
 * Also provides some logic around updating these settings.
 * */
    .factory('GlobalData', ['storeConfig', '$translate', 'CookieSvc', '$rootScope',
        function (storeConfig, $translate, CookieSvc, $rootScope) {

            var languageCode = storeConfig.defaultLanguage || 'en';
            var acceptLanguages = languageCode;
            var storeCurrency = 'USD';
            var availableCurrencies = [storeCurrency];

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

                store: {
                    tenant: storeConfig.storeTenant,
                    name: '',
                    logo: null
                },

                user: {
                    isAuthenticated: false,
                    username: null
                },


                getCurrencySymbol: function () {
                    var symbol = '?';
                    if (storeCurrency === 'USD') {
                        symbol = '$';
                    }
                    else if (storeCurrency === 'EUR') {
                        symbol = '\u20AC';
                    }
                    return symbol;
                },

                setLanguage: function (newLangCode) {
                    if(newLangCode) {
                        if (languageCode !== newLangCode) {
                            languageCode = newLangCode;
                            $translate.use(languageCode);
                            acceptLanguages = (languageCode === storeConfig.defaultLanguage ? languageCode : languageCode + ';q=1,' + storeConfig.defaultLanguage + ';q=0.5');
                        }
                        CookieSvc.setLanguageCookie(languageCode);
                    }
                },

                getLanguageCode: function(){
                    return languageCode;
                },

                getAcceptLanguages: function(){
                  return acceptLanguages;
                },

                setCurrency: function (newCurr) {
                    if(newCurr && availableCurrencies && availableCurrencies.indexOf(newCurr)>-1) {
                        if(newCurr!==storeCurrency){
                            storeCurrency = newCurr;
                            $rootScope.$emit('currency:updated', newCurr);
                        }
                        CookieSvc.setCurrencyCookie(newCurr);
                    } else {
                        console.error('Currency not valid: '+newCurr);
                    }
                },

                getCurrency: function(){
                    return storeCurrency;
                },

                setAvailableCurrencies: function(currs){
                    availableCurrencies = currs;
                },

                getAvailableCurrencies: function(){
                    return availableCurrencies;
                }
            };

        }]);
