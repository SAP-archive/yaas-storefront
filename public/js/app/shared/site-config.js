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

        function SiteConfigSvcProvider(appConfig) {

            var apiPath, tenantId = '';

            // handle dynamic tenant data.
            if (!_.isEmpty(appConfig) && !_.isEmpty(appConfig.storeTenant())) {
                tenantId = appConfig.storeTenant();
            }
            // handle dynamic domain data.
            if (!_.isEmpty(appConfig) && !_.isEmpty(appConfig.dynamicDomain())) {
                apiPath = appConfig.dynamicDomain();
            }

            this.apis = {
                account: {
                    baseUrl: 'https://' + apiPath + '/hybris/account/v2',
                    addresses: {
                        initialPageSize: 6
                    }
                },

                cart: {
                    baseUrl: 'https://' + apiPath + '/hybris/cart/b1/' + tenantId
                },

                categories: {
                    baseUrl: 'https://' + apiPath + '/hybris/category/b1/' + tenantId
                },

                checkout: {
                    baseUrl: 'https://' + apiPath + '/hybris/checkout-mashup/b1/' + tenantId
                },

                configuration: {
                    baseUrl: 'https://' + apiPath + '/hybris/configuration/b1/' + tenantId
                },

                coupon: {
                    baseUrl: 'https://' + apiPath + '/hybris/coupon/b1/' + tenantId
                } ,

                customers: {
                    baseUrl: 'https://' + apiPath + '/hybris/customer/b1/' + tenantId
                },

                orders: {
                    baseUrl: 'https://' + apiPath + '/order/v4/' + tenantId
                },

                prices: {
                    baseUrl: 'https://' + apiPath + '/hybris/price/b1/' + tenantId
                },

                products: {
                    baseUrl: 'https://' + apiPath + '/hybris/product/b1/' + tenantId,
                    pageSize: 10
                },

                productDetails: {
                    baseUrl: 'https://' + apiPath + '/hybris/product-details/b1/' + tenantId
                },

                shippingCosts: {
                    baseUrl: 'https://' + apiPath + '/shipping-cost/v4/' + tenantId
                },

                tracking: {
                    baseUrl: ' https://' + apiPath + '/stork/piwik/v1/' + tenantId + '/events'
                }
            };

            this.$get = ['appConfig',
                function (appConfig) {
                    return new SiteConfigSvcProvider(appConfig);
                }
            ];

        }
    ]);
