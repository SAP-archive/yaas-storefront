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
 *  Encapsulates configuration of the price, products, and productDetails APIs.
 */
angular.module('ds.products')
    .factory('PriceProductREST', ['settings', 'Restangular', 'GlobalData', function(settings, Restangular, GlobalData){
        function applyLanguageHeader(RestangularConfigurer){
            RestangularConfigurer.setFullRequestInterceptor(function(element, operation, route, url, headers, params, httpConfig) {

                return {
                    element: element,
                    params: params,
                    headers: _.extend(headers, {'accept-language': GlobalData.acceptLanguages}),
                    httpConfig: httpConfig
                };
            });
        }

            return {
                /** Endpoint for Prices API.*/
                Prices: Restangular.withConfig(function (RestangularConfigurer) {
                    RestangularConfigurer.setBaseUrl(settings.apis.prices.baseUrl);
                }),
                /** Endpoint for Products API. */
                Products: Restangular.withConfig(function(RestangularConfigurer) {
                        RestangularConfigurer.setBaseUrl(settings.apis.products.baseUrl);
                        RestangularConfigurer.setResponseInterceptor(function (data, operation, what, url, response) {
                            var headers = response.headers();
                            var result = response.data;
                            result.headers = headers;
                            return result;
                        });
                        applyLanguageHeader(RestangularConfigurer);

                    }),
                /** Endpoint for ProductDetails API. */
                ProductDetails: Restangular.withConfig(function(RestangularConfigurer) {
                    RestangularConfigurer.setBaseUrl(settings.apis.productDetails.baseUrl);
                    applyLanguageHeader(RestangularConfigurer);
                })
            };


    }]);