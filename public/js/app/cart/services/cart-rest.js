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

angular.module('ds.cart')
    .factory('CartREST', ['Restangular', 'SiteConfigSvc', 'GlobalData', function(Restangular, siteConfig, GlobalData){

        return {
            /** Endpoint for Main Cart.*/
            Cart: Restangular.withConfig(function (RestangularConfigurer) {
                RestangularConfigurer.setBaseUrl(siteConfig.apis.cart.baseUrl);
                RestangularConfigurer.addFullRequestInterceptor(function (element, operation, route, url, headers, params, httpConfig) {
                    return {
                        element: element,
                        params: params,
                        headers: _.extend(headers, { 'hybris-site': GlobalData.getSiteCode() }),
                        httpConfig: httpConfig
                    };
                });
            }),

            CalculateCart: Restangular.withConfig(function (RestangularConfigurer) {
                RestangularConfigurer.setBaseUrl(siteConfig.apis.cartcalculation.baseUrl);
                RestangularConfigurer.addFullRequestInterceptor(function (element, operation, route, url, headers, params, httpConfig) {
                    return {
                        element: element,
                        params: params,
                        headers: _.extend(headers, { 'hybris-site': GlobalData.getSiteCode() }),
                        httpConfig: httpConfig
                    };
                });
            })
        };


    }]);