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

/** REST service configuration for the "configuration" API. */
angular.module('ds.shared')
    .factory('ConfigurationREST', ['Restangular', 'SiteConfigSvc', function(Restangular, siteConfig){

        return {
            /** Main configuration endpoint.*/
            Config: Restangular.withConfig(function(RestangularConfigurer) {
                RestangularConfigurer.setBaseUrl(siteConfig.apis.configuration.baseUrl);
            })
        };

    }]);