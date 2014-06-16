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
 *  Encapsulates access to the CAAS configuration API.
 */
angular.module('ds.shared')
    .factory('ConfigSvc', ['caas',  'settings', function(caas, settings){

        return {


            /**
             * Registers a success callback handler on the API 'query' request - invoked once the
             * promise is resolved.
             * @param {parms} query parameters
             * @param {callback} success callback function
             */
            loadConfiguration: function() {
                var config = caas.config.API.get();
                config.$promise.then(function (result) {
                    console.log(result.properties);
                    for (var i=0,  tot=result.properties.length; i < tot; i++) {
                        if(result.properties[i].key === settings.configKeys.stripeKey) {
                            /* jshint ignore:start */
                            Stripe.setPublishableKey(result.properties[i].value);
                            /* jshint ignore:end */
                        }
                    }

                }, function(error){
                    console.log(error);
                });

            }

        };
    }]);