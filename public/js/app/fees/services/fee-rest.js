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

angular.module('ds.fees')
    .factory('FeeREST', ['Restangular', 'settings', 'GlobalData', function(Restangular, settings, GlobalData){

        return {
            // By default, we don't expose a Restangular configuration on the Fee property.
            // init() is responsible to expose a Restangular configuration or not if the site contains a feeService mixin
            Fee: null,
            init: function() {
                // Retrieve the site mixins persisted in GlobalData
                var siteMixins = GlobalData.getSiteMixins();
                // Search for the feeService mixin that contains the service configuration
                var feeServiceConfig = siteMixins[settings.feeServiceMixinKey];
                // Retrieve the current tenantID
                var tenantID = GlobalData.store.tenant;
                // Make sure we have all the information we need to setup Restangular
                if(_.isObject(feeServiceConfig) && _.has(feeServiceConfig, settings.feeServiceUrlKey) && !_.isEmpty(feeServiceConfig) && !_.isEmpty(tenantID)) {
                    this.Fee = Restangular.withConfig(function (RestangularConfigurer) {
                        // Define the base URL
                        RestangularConfigurer.setBaseUrl(feeServiceConfig.serviceUrl + tenantID);
                        // And add a request interceptor
                        RestangularConfigurer.addFullRequestInterceptor(function(element, operation, route, url, headers, params, httpConfig) {
                            return {
                                element: element,
                                params: params,
                                headers: headers,
                                httpConfig: httpConfig
                            };
                        });
                    });
                }
                else {
                    // Otherwise, don't expose a Restangular configuration
                    this.Fee = null;
                }
            }
        };

    }]);