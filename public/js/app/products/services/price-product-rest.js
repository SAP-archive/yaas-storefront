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
 *  Encapsulates configuration of the price, products, and productDetails APIs.
 */
angular.module('ds.products')
    .factory('PriceProductREST', ['SiteConfigSvc', 'Restangular', 'GlobalData', function(siteConfig, Restangular, GlobalData){
        function applyLanguageHeader(RestangularConfigurer){
            RestangularConfigurer.addFullRequestInterceptor(function(element, operation, route, url, headers, params, httpConfig) {

                return {
                    element: element,
                    params: params,
                    headers: _.extend(headers, {'accept-language': GlobalData.getAcceptLanguages()}, {'hybris-currency': GlobalData.getCurrencyId()}),
                    httpConfig: httpConfig
                };
            });
        }

            return {
                /** Endpoint for Prices API.*/
                Prices: Restangular.withConfig(function (RestangularConfigurer) {
                    RestangularConfigurer.setBaseUrl(siteConfig.apis.prices.baseUrl);
                }),
                /** Endpoint for Products API. */
                Products: Restangular.withConfig(function(RestangularConfigurer) {
                        RestangularConfigurer.setBaseUrl(siteConfig.apis.products.baseUrl);
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
                    RestangularConfigurer.setBaseUrl(siteConfig.apis.productDetails.baseUrl);
                    RestangularConfigurer.setResponseInterceptor(function (data, operation, what, url, response) {
                        var headers = response.headers();
                        var result = response.data;
                        result.headers = headers;
                        return result;
                    });
                    applyLanguageHeader(RestangularConfigurer);
                }),
                /** Endpoint for Category API.*/
                Categories: Restangular.withConfig(function(RestangularConfigurer) {
                    RestangularConfigurer.setBaseUrl(siteConfig.apis.categories.baseUrl);
                    applyLanguageHeader(RestangularConfigurer);
                })
            };


    }]);