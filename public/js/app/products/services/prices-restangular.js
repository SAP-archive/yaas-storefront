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
    .factory('PricesRest', ['settings', 'Restangular', function(settings, Restangular){

        var PricesRest = Restangular.withConfig(function(RestangularConfigurer) {
            RestangularConfigurer.setBaseUrl(settings.apis.prices.baseUrl);
        });

        return PricesRest;

    }]);