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
 *  Encapsulates access to the configuration service.
 */
angular.module('ds.shared')
    .factory('ConfigSvc', ['caas',  'settings', 'GlobalData', function(caas, settings, GlobalData){

        return {


            /**
             * Loads the store configuration settings - the public Stripe key, store name and logo.
             * These settings are then stored in the GlobalData service.
             */
            loadConfiguration: function() {
                var config = caas.config.API.get();
                config.$promise.then(function (result) {
                    var key = null;
                    var value = null;
                    for (var i=0,  tot=result.properties.length; i < tot; i++) {
                        key =  result.properties[i].key;
                        value = result.properties[i].value;
                        if(key === settings.configKeys.stripeKey) {
                            /* jshint ignore:start */
                            Stripe.setPublishableKey(value);
                            /* jshint ignore:end */
                        }  else if (key === settings.configKeys.storeName) {
                            GlobalData.store.name = value;
                        } else if (key === settings.configKeys.storeLogo) {
                            GlobalData.store.logo = value;
                        }
                    }
                }, function(error){
                    console.error('Store settings retrieval failed: '+ JSON.stringify(error));
                });

            }

        };
    }]);