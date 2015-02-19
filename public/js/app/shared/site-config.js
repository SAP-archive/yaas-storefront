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

angular.module('ds.shared')

/**
 * Provides default settings for the application, tenant configured dynamically in service provider.
 *
 * @type {Object}
 */
/** Acts as URL provider for service API's. */
    .provider('SiteConfigSvc', [

        function SiteConfigSvcProvider(storeConfig) {

            // Dynamic Domain is generated and replaced by build script, see gruntfile.
            var dynamicDomain = /*StartDynamicDomain*/ 'yaas-test.apigee.net/test' /*EndDynamicDomain*/;

            var tenantId = '';

            // handle dynamic tenant data.
            if(!_.isEmpty(storeConfig) && !_.isEmpty(storeConfig.storeTenant)) {
                tenantId = storeConfig.storeTenant;
            }

            this.apis = {
                account: {
                    baseUrl: 'https://' + dynamicDomain + '/account/v1',
                    addresses: {
                        initialPageSize: 6
                    }
                },

                cart: {
                    baseUrl: 'https://' + dynamicDomain + '/cart/v5/' + tenantId
                },

                categories: {
                    baseUrl: 'https://' + dynamicDomain + '/category/v2/' + tenantId
                },

                checkout: {
                    baseUrl: 'https://' + dynamicDomain + '/checkout-mashup/v4/' + tenantId
                },

                configuration: {
                    baseUrl: 'https://' + dynamicDomain + '/configuration/v4/' + tenantId
                } ,

                customers: {
                    baseUrl: 'https://' + dynamicDomain + '/customer/v6/' + tenantId
                },

                orders: {
                    baseUrl: 'https://' + dynamicDomain + '/order/v4/' + tenantId
                },

                prices: {
                    baseUrl: 'https://' + dynamicDomain + '/price/v4/' + tenantId
                },

                products: {
                    baseUrl: 'https://' + dynamicDomain + '/product/v3/' + tenantId,
                    pageSize: 10
                },

                productDetails: {
                    baseUrl: 'https://' + dynamicDomain + '/product-details/v3/' + tenantId
                },

                shippingCosts: {
                    baseUrl: 'https://' + dynamicDomain + '/shipping-cost/v4/' + tenantId
                }
            };

            this.$get = ['storeConfig',
                function(storeConfig) {
                    return new SiteConfigSvcProvider(storeConfig);
                }
            ];

        }
    ]);
