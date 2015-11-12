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
            var selectedSiteCode = '';

            /**
            * Returns default or first site from sites array.
            */
            function getDefaultSite(sites) {
                for (var i = 0; i < sites.length; i++) {
                    if (sites[i].default) {
                        return sites[i];
                    }
                }
                return sites[0];
            }

            /**
            * Check if there is site in sites with specified code.
            */
            function siteExists(sites, code) {
                for (var i = 0; i < sites.length; i++) {
                    if (sites[i].code === code) {
                        return true;
                    }
                }
                return false;
            }

            /**
             * Loads the store configuration settings - store name and logo.
             * These settings are then stored in the GlobalData service.
             * Returns promise once done.
             */
            function loadConfiguration() {

                /**
                * Get default site for the moment
                */
                var configPromise = SiteSettingsREST.SiteSettings.all('sites').getList({});
                configPromise.then(function (sites) {

                    //Check if there is already default site in memory or cookies and if that one is valid one (exists in returned array)
                    var result;
                    var site = GlobalData.getSite();
                    if (!!site && siteExists(sites, site.code)) {
                        result = site;
                    }
                    else {
                        //If not, then use default one from returned array of sites
                        result = getDefaultSite(sites);

                        //Save selected site as cookie
                        GlobalData.setSiteCookie(result);
                    }

                    selectedSiteCode = result.code;
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

                return $q.all([configPromise]);
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

                            var siteSettingPromise = SiteSettingsREST.SiteSettings.one('sites', selectedSiteCode).get({ expand: 'payment:active,tax:active,mixin:*' });
                            siteSettingPromise.then(function (site) {

                                //Set site and load initial language
                                GlobalData.setSite(site);
                                GlobalData.loadInitialLanguage();

                                if (AuthSvc.isAuthenticated()) {
                                    // if session still in tact, load user preferences
                                    AccountSvc.account().then(function (account) {
                                        CategorySvc.getCategories().then(function () {
                                            def.resolve({});
                                        });

                                        return account;
                                    }).then(function (account) {
                                        if(account) {
                                            CartSvc.refreshCartAfterLogin(account.id);
                                        }
                                    });
                                } else {
                                    CategorySvc.getCategories().then(function () {
                                        def.resolve({});
                                    });

                                    //We are getting cart with siteChange that happens on load
                                    //CartSvc.getCart(); // no need to wait for cart promise to resolve

                                }
                                initialized = true;
                            });
                        }, function (error) {
                            console.error('Store settings retrieval failed: ' + JSON.stringify(error));
                            // no point trying to localize, since we couldn't load language preferences
                            window.alert('Unable to load store configuration.  Please refresh!');
                        });
                    }
                    return def.promise;
                }


            };
        }]);
