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
            var activeCurrencyId = 'USD';
            var availableCurrencies = [{id: activeCurrencyId, label: 'US Dollar'}];
            var currencyIds=[];

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

                /** Returns the currency symbol of the active currency.*/
                getCurrencySymbol: function (optionalId) {
                    var id = optionalId || activeCurrencyId;
                    var symbol = '?';
                    if (id === 'USD') {
                        symbol = '$';
                    }
                    else if (id === 'EUR') {
                        symbol = '\u20AC';
                    }
                    return symbol;
                },

                /** Sets the code of the language that's supposed to be active for the store.*/
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

                /** Returns the language code that's currently active for the store.*/
                getLanguageCode: function(){
                    return languageCode;
                },

                /** Returns the 'accept-languages' header for the application.*/
                getAcceptLanguages: function(){
                  return acceptLanguages;
                },

                /** Sets the currency id that's supposed to be active for this store.
                 * If the id is not part of the "available" currencies, the update will be silently rejected.*/
                setCurrency: function (newCurr) {
                    if(newCurr && currencyIds && currencyIds.indexOf(newCurr)>-1) {
                        if(newCurr!==activeCurrencyId){
                            activeCurrencyId = newCurr;
                            $rootScope.$emit('currency:updated', newCurr);
                        }
                        CookieSvc.setCurrencyCookie(newCurr);
                    } else {
                        console.error('Currency not valid: '+newCurr);
                    }
                },

                /** Returns the id of the currency that's currently active for the store.*/
                getCurrencyId: function(){
                    return activeCurrencyId;
                },

                /** Sets an array of currency instances from which a shopper should be able to choose.*/
                setAvailableCurrencies: function(currencies){
                    if(currencies) {
                        availableCurrencies = currencies;
                        var self = this;

                        angular.forEach(currencies, function (currency) {
                            currencyIds.push(currency.id);
                            if (currency.default) {
                                self.setCurrency(currency.id);
                            }
                        });
                    }

                },

                /** Returns an array of currency instances supported by this project.*/
                getAvailableCurrencies: function(){
                    return availableCurrencies;
                }
            };

        }]);
