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

/** REST configuration for services related to authorization. */
angular.module('ds.auth')
    .factory('AuthREST', ['settings', 'Restangular', function(settings, Restangular){

        return {
            /** Configures main authorization API endpoint.*/
            Customers: Restangular.withConfig(function(RestangularConfigurer) {
                RestangularConfigurer.setBaseUrl(settings.apis.customers.baseUrl);
            })

        };


    }]);