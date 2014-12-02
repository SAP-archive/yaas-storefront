/**
 * [y] hybris Platform
 *
 * Copyright (c) 2000-2014 hybris AG
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
    .factory('EventSvc', ['$rootScope', '$state', '$stateParams', 'settings', 'CartSvc', 'CategorySvc',
        function ($rootScope, $state, $stateParams, settings, CartSvc, CategorySvc) {

            return {

                /**
                 * Handle "currency changed".
                 */
                onCurrencyChange: function (eve, eveObj) {
                    if ($state.is('base.checkout.details')){
                        CartSvc.switchCurrency(eveObj.currencyId).then(function(){
                            $state.transitionTo($state.current, $stateParams, {
                                reload: true,
                                inherit: true,
                                notify: true
                            });
                        });
                    } else {

                        if ( eveObj.source !== settings.eventSource.login && eveObj.source !== settings.eventSource.initialization) {
                            CartSvc.switchCurrency(eveObj.currencyId);
                        }
                        if($state.is('base.category') || $state.is('base.product.detail') ) {
                            $state.transitionTo($state.current, $stateParams, {
                                reload: true,
                                inherit: true,
                                notify: true
                            });
                        }
                    }
                },

                /**
                 * Handle "language changed".
                 * @param eve language changed event
                 * @param eveObj - property: languageCode
                 */
                onLanguageChange: function(eve, eveObj) {
                    if ( eveObj.source !== settings.eventSource.login && eveObj.source !== settings.eventSource.initialization) {
                        CartSvc.getCart();
                    }
                    if($state.is('base.category') || $state.is('base.product.detail')) {
                        $state.transitionTo($state.current, $stateParams, {
                            reload: true,
                            inherit: true,
                            notify: true
                        });
                    } else {
                        CategorySvc.getCategories();
                    }
                }

            };
        }]);
