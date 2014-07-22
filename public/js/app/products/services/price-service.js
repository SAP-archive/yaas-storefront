/*
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
 *  Encapsulates access to the CAAS price API.
 */
angular.module('ds.products')
    .factory('PriceSvc', ['PricesRest', function(PricesRest){

        var getPrices = function (parms) {
            return PricesRest.one('prices').get(parms);
        };

        return {

            /**
             * Retrieves prices list based on provided parameters (filter)
             * @param {parms} query parameters
             */
            query: function(parms) {
                return getPrices(parms);
            }

            /**
             * Registers a success callback handler on the API 'query' request - invoked once the
             * promise is resolved.
             * @param {parms} query parameters
             * @param {callback} success callback function
             */
            // queryWithResultHandler: function(parms, callback) {
            //     var prices = getPrices(parms);
            //     prices.$promise.then(function (result) {
            //         callback(result);
            //     });
            // }

        };

    }]);