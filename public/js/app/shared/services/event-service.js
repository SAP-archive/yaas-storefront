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
 *  Encapsulates complex event logic, such as reloading states or reloading objects that are not specific to a particular page.
 */
angular.module('ds.shared')
    .factory('EventSvc', ['$state', '$stateParams', 'settings', 'CartSvc', 'CategorySvc',
        function ($state, $stateParams, settings, CartSvc, CategorySvc) {

            return {

                /**
                 * Handle "site changed".
                 */
                onSiteChange: function () {

                    CartSvc.getCart();

                    if ($state.is('base.checkout.details') || $state.is('base.category') || $state.is('base.product.detail')) {
                        $state.transitionTo($state.current, $stateParams, {
                            reload: true,
                            inherit: true,
                            notify: true
                        });
                    }
                },

                /**
                 * Handle "language changed".
                 * @param eve language changed event
                 * @param eveObj - property: languageCode
                 */
                onLanguageChange: function (eve, eveObj) {

                    // cart is already loaded on login, initialization and siteChange - no need for separate refresh
                    if (eveObj.source !== settings.eventSource.login && eveObj.source !== settings.eventSource.initialization && eveObj.source !== settings.eventSource.siteUpdate) {
                        CartSvc.getCart();
                    }
                    // Any state that requires an updated localized data load should be refreshed (with exception of checkout,
                    //   as cart update is handled separately due to its global nature)
                    CategorySvc.getCategories(settings.eventSource.languageUpdate).then(function () {
                        if ($state.is('base.category') || $state.is('base.product.detail')) {
                            $state.transitionTo($state.current, $stateParams, {
                                reload: true,
                                inherit: true,
                                notify: true
                            });
                        }
                    });
                }

            };
        }]);
