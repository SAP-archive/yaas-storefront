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
 *  Encapsulates access to the price API.
 */
angular.module('ds.products')
    .factory('PriceSvc', ['PriceProductREST', function(PriceProductREST){

        var getPrices = function (parms) {
            return PriceProductREST.Prices.one('prices').get(parms);
        };

        return {
            /**
             * Retrieves prices list based on provided parameters (filter)
             * @param {parms} query parameters
             */
            query: function(parms) {
                return getPrices(parms);
            }
        };

    }]);