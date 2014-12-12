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

/** REST configuration for services related to authorization. */
angular.module('ds.auth')
    .factory('AuthREST', ['Restangular', 'SiteConfigSvc', function(Restangular, siteConfig){

        return {
            /** Configures main authorization API endpoint.*/
            Customers: Restangular.withConfig(function(RestangularConfigurer) {
                RestangularConfigurer.setResponseInterceptor(function (data, operation, what, url, response) {
                    var headers, result = response.data;
                    if (result && operation === 'getList' && what ==='addresses') {
                      headers = response.headers();
                      result.headers = headers;
                    }
                    return result;
                });
                RestangularConfigurer.setBaseUrl(siteConfig.apis.customers.baseUrl);
            })

        };


    }]);