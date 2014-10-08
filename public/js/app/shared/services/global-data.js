'use strict';

angular.module('ds.shared')
/** Acts as global data store for application settings. In contrast to the "settings" constant provider,
 * these settings may change over the life of the application.
 *
 * Also provides some logic around updating these settings.
 * */
    .service('GlobalData', ['$rootScope', 'storeConfig', '$translate', 'CookieSvc',
        function ($rootScope, storeConfig, $translate, CookieSvc) {

            this.languageCode = storeConfig.defaultLanguage;
            this.acceptLanguages = storeConfig.defaultLanguage;
            this.storeCurrency = storeConfig.defaultCurrency;


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
                    if (this.storeCurrency === 'USD') {
                        symbol = '$';
                    }
                    else if (this.storeCurrency === 'EUR') {
                        symbol = '\u20AC';
                    }
                    return symbol;
                },


                setLanguage: function (newLangCode) {
                    if (this.languageCode !== newLangCode) {
                        this.languageCode = newLangCode;
                        $translate.use(this.languageCode);
                        this.acceptLanguages = (this.languageCode === storeConfig.defaultLanguage ? this.languageCode : this.languageCode + ';q=1,' + storeConfig.defaultLanguage + ';q=0.5');
                    }
                    CookieSvc.setLanguageCookie(this.languageCode);
                },

                setCurrency: function (newCurr) {

                    this.storeCurrency = currency;
                    CookieSvc.setCurrencyCookie(currency);
                }
            };

        }]);
