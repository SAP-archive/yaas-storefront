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
 *  Encapsulates access to the configuration service.
 */
angular.module('ds.shared')
    .factory('ConfigSvc', ['$rootScope', '$q', 'settings', 'GlobalData', 'AuthSvc', 'AccountSvc', 'CartSvc', 'CategorySvc', 'SiteSettingsREST',
        function ($rootScope, $q, settings, GlobalData, AuthSvc, AccountSvc, CartSvc, CategorySvc, SiteSettingsREST) {
            var initialized = false;


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

            function getDefaultSite(sites) {
                for (var i = 0; i < sites.length; i++) {
                    if (sites[i].default) {
                        return sites[i];
                    }
                }
                return sites[0];
            }

            /**
             * Loads the store configuration settings - store name and logo.
             * These settings are then stored in the GlobalData service.
             * Returns promise once done.
             */
            function loadConfiguration() {
                var params = { expand: 'payment:all,mixin:*' };

                /**
                * Get default site for the moment
                */
                var configPromise = SiteSettingsREST.SiteSettings.all('sites').getList(params);
                configPromise.then(function (sites) {

                    var result = getDefaultSite(sites);

                    //Create array
                    var currency = [{ id: result.currency, label: '' }];
                    currency[0]['default'] = true;
                    GlobalData.setAvailableCurrencies(currency);


                    //Set default language
                    GlobalData.setDefaultLanguage(getLanguageById(result.defaultLanguage));

                    //Set languages
                    var languages = [];
                    if (!!result.languages) {
                        for (var i = 0; i < result.languages.length; i++) {
                            languages.push(getLanguageById(result.languages[i]));
                        }
                    }
                    GlobalData.setAvailableLanguages(languages);


                    GlobalData.setSite(result);
                    GlobalData.setSites(sites);

                    //TODO: Missing implementation for Algolia key
                    //GlobalData.search.algoliaKey = value;



                }, function (error) {
                    console.error('Store settings retrieval failed: ' + JSON.stringify(error));
                    // no point trying to localize, since we couldn't load language preferences
                    window.alert('Unable to load store configuration.  Please refresh!');
                });


                /**
                * Get login config (Facebook and Google)
                */
                var loginConfigPromise = AuthSvc.getFBAndGoogleLoginKeys();
                loginConfigPromise.then(function (result) {

                    if (!!result.facebookAppId) {
                        settings.facebookAppId = result.facebookAppId;
                    }
                    if (!!result.googleClientId) {
                        settings.googleClientId = result.googleClientId;
                    }
                }, function (error) {
                    console.error('Facebook and Google key retrieval failed: ' + JSON.stringify(error));
                });


                //return $q.all([configPromise]);
                return $q.all([configPromise, loginConfigPromise]);
            }


            return {

                /**
                 * Returns an empty promise that is resolved once the app has been initialized with all essential data.
                 */
                initializeApp: function () {
                    var def = $q.defer();
                    if (initialized) {
                        def.resolve({});
                    } else {
                        loadConfiguration(GlobalData.store.tenant).then(function () {
                            var languageSet = false;
                            var currencySet = false;
                            if (AuthSvc.isAuthenticated()) {
                                // if session still in tact, load user preferences
                                AccountSvc.account().then(function (account) {
                                    if (account.preferredLanguage) {
                                        GlobalData.setLanguage(account.preferredLanguage.split('_')[0], settings.eventSource.initialization);
                                        languageSet = true;
                                    }
                                    if (account.preferredCurrency) {
                                        GlobalData.setCurrency(account.preferredCurrency, settings.eventSource.initialization);
                                        currencySet = true;
                                    }

                                    if (!languageSet) {
                                        GlobalData.loadInitialLanguage();
                                    }
                                    if (!currencySet) {
                                        GlobalData.loadInitialCurrency();
                                    }
                                    CategorySvc.getCategories().then(function () {
                                        def.resolve({});
                                    });

                                    return account;
                                }).then(function (account) {
                                    CartSvc.refreshCartAfterLogin(account.id);
                                });
                            } else {
                                GlobalData.loadInitialLanguage();
                                GlobalData.loadInitialCurrency();

                                CategorySvc.getCategories().then(function () {
                                    def.resolve({});
                                });
                                CartSvc.getCart(); // no need to wait for cart promise to resolve

                            }
                            initialized = true;
                        });
                    }
                    return def.promise;
                }


            };
        }]);
