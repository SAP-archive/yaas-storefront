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

/** REST configuration for services related to checkout. */
angular.module('ds.orders')
    .factory('OrdersREST', ['Restangular', 'SiteConfigSvc', function(Restangular, siteConfig){

        return {
            /** Configures main orders API endpoint.*/
            Orders: Restangular.withConfig(function(RestangularConfigurer) {
                RestangularConfigurer.setResponseInterceptor(function (data, operation, what, url, response) {
                    var headers = response.headers();
                    var result = response.data;
                    if(result){
                        result.headers = headers;
                    }
                    return result;
                });
                RestangularConfigurer.setBaseUrl(siteConfig.apis.orders.baseUrl);
            })
        };


    }]);