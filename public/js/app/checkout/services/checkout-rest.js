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
angular.module('ds.checkout')
    .factory('CheckoutREST', ['Restangular', 'SiteConfigSvc', 'GlobalData', function(Restangular, siteConfig, GlobalData){
        return {
            /** Configures main checkout API endpoint.*/
            Checkout: Restangular.withConfig(function(RestangularConfigurer) {
							RestangularConfigurer.setBaseUrl(siteConfig.apis.checkout.baseUrl);

                RestangularConfigurer.addFullRequestInterceptor(function(element, operation, route, url, headers, params, httpConfig) {
                    return {
                        element: element,
                        params: params,
                        headers: _.extend(headers, {'Accept-Language': GlobalData.getAcceptLanguages()}),
                        httpConfig: httpConfig
                    };
                });
            }),

            /** Configures main shipping costs API endpoint.*/
            ShippingCosts: Restangular.withConfig(function(RestangularConfigurer) {
							RestangularConfigurer.setBaseUrl(siteConfig.apis.shippingCosts.baseUrl);
                            RestangularConfigurer.addFullRequestInterceptor(function(element, operation, route, url, headers, params, httpConfig) {

                                return {
                                    element: element,
                                    params: params,
                                    headers: _.extend(headers, {'hybris-currency': GlobalData.getCurrencyId()}),
                                    httpConfig: httpConfig
                                };
                            });
            }),

            ShippingZones: Restangular.withConfig(function(RestangularConfigurer) {
                            RestangularConfigurer.setBaseUrl(siteConfig.apis.shippingZones.baseUrl);
                            RestangularConfigurer.addFullRequestInterceptor(function(element, operation, route, url, headers, params, httpConfig) {

                                return {
                                    element: element,
                                    params: params,
                                    headers: _.extend(headers, {'hybris-currency': GlobalData.getCurrencyId()}),
                                    httpConfig: httpConfig
                                };
                            });
            })

        };


    }]);