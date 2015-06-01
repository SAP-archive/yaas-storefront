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
    .factory('ConfigSvc', ['$rootScope', '$q', 'settings', 'GlobalData', 'ConfigurationREST', 'AuthSvc', 'AccountSvc', 'CartSvc', 'CategorySvc', 'SiteSettingsREST',
        function ($rootScope, $q, settings, GlobalData, ConfigurationREST, AuthSvc, AccountSvc, CartSvc, CategorySvc, SiteSettingsREST) {
            var initialized = false;

            /**
             * Loads the store configuration settings - the public Stripe key, store name and logo.
             * These settings are then stored in the GlobalData service.
             * Returns promise once done.
             */
            function loadConfiguration() {
                var params = { expand: 'payment:active,mixin:*' };

                //SiteSettingsREST.SiteSettings.all('sites').getList(params)
                //SiteSettingsREST.SiteSettings.one('sites', code).get(params);

                //Get default site
                var configPromise = SiteSettingsREST.SiteSettings.one('sites', 'default').get(params).then(function (result) {

                    //Set name
                    GlobalData.store.name = result.name;
                    $rootScope.titleConfig = result.name;

                    //Set stripe key if defined
                    if (!!result.payment[0] && !!result.payment[0].configuration && !!result.payment[0].configuration.public && !!result.payment[0].configuration.public.publicKey) {
                        /* jshint ignore:start */
                        Stripe.setPublishableKey(result.payment[0].configuration.public.publicKey);
                        /* jshint ignore:end */
                    }
                    //Set main image
                    if (!!result.mixins && !!result.mixins.storeLogoImageKey && !!result.mixins.storeLogoImageKey.value) {
                        GlobalData.store.logo = result.mixins.storeLogoImageKey.value;
                    }

                    //Create array
                    var currency = [{ id: result.currency, label: '' }];
                    currency[0]['default'] = true;
                    GlobalData.setAvailableCurrencies(currency);


                    //Set default language
                    GlobalData.setDefaultLanguage(result.defaultLanguage);

                    //Set languages
                    GlobalData.setAvailableLanguages(result.languages);

                }, function (error) {
                    console.error('Store settings retrieval failed: ' + JSON.stringify(error));
                    // no point trying to localize, since we couldn't load language preferences
                    window.alert('Unable to load store configuration.  Please refresh!');
                });

                return configPromise;

                ////Temporary solution to get all configurations, before the page size was 16 so sometimes we were missing algolia_key for example
                //var configPromise = ConfigurationREST.Config.one('configurations').get({ pageSize: 100 }).then(function (result) {
                //    var key = null;
                //    var value = null;

                //    for (var i = 0, tot = result.length; i < tot; i++) {
                //        var entry = result[i];
                //        key = entry.key;
                //        value = entry.value;
                //        if (key === settings.configKeys.stripeKey) {
                //            /* jshint ignore:start */
                //            Stripe.setPublishableKey(value);
                //            /* jshint ignore:end */
                //        } else if (key === settings.configKeys.storeName) {
                //            GlobalData.store.name = value;
                //            $rootScope.titleConfig = value;
                //        } else if (key === settings.configKeys.storeLogo) {
                //            GlobalData.store.logo = value;
                //        } else if (key === settings.configKeys.storeCurrencies) {
                //            GlobalData.setAvailableCurrencies(JSON.parse(value));
                //        } else if (key === settings.configKeys.storeLanguages) {
                //            GlobalData.setAvailableLanguages(JSON.parse(value));
                //        } else if (key === settings.configKeys.fbAppIdKey) {
                //            settings.facebookAppId = value;
                //        } else if (key === settings.configKeys.googleClientId) {
                //            settings.googleClientId = value;
                //        }
                //        else if (key === 'algolia_key') {
                //            GlobalData.search.algoliaKey = value;
                //        }
                //    }

                //    return result;
                //}, function (error) {
                //    console.error('Store settings retrieval failed: ' + JSON.stringify(error));
                //    // no point trying to localize, since we couldn't load language preferences
                //    window.alert('Unable to load store configuration.  Please refresh!');
                //});
                //return configPromise;
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
