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

angular.module('ds.prices')
    .factory('PriceSvc', ['$rootScope', 'caas', function($rootScope, caas){

        return {

            getPriceBySku: function (sku) {
                return caas.priceBySku.API.get({productId: sku}).$promise
                    .then(function(result){
                        return result.prices[0].price;
                    });
            }

        };

    }]);
