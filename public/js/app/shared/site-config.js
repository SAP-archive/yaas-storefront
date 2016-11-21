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
                    baseUrl: 'https://' + apiPath + '/hybris/account/v1',
                    addresses: {
                        initialPageSize: 6
                    }
                },

                cart: {
                    baseUrl: 'https://' + apiPath + '/hybris/cart/v1/' + tenantId
                },

                cartcalculation: {
                    baseUrl: 'https://' + apiPath + '/hybris/cartcalculation/v1/' + tenantId
                },

                categories: {
                    baseUrl: 'https://' + apiPath + '/hybris/category/v1/' + tenantId
                },

                checkout: {
                    baseUrl: 'https://' + apiPath + '/hybris/checkout/v1/' + tenantId
                },

                coupon: {
                    baseUrl: 'https://' + apiPath + '/hybris/coupon/v1/' + tenantId
                },

                customers: {
                    baseUrl: 'https://' + apiPath + '/hybris/customer/v1/' + tenantId
                },

                orders: {
                    baseUrl: 'https://' + apiPath + '/hybris/order/v1/' + tenantId
                },

                prices: {
                    baseUrl: 'https://' + apiPath + '/hybris/price/v1/' + tenantId
                },

                products: {
                    baseUrl: 'https://' + apiPath + '/hybris/product/v2/' + tenantId,
                    pageSize: 10
                },

                productDetails: {
                    baseUrl: 'https://' + apiPath + '/hybris/productdetails/v1/' + tenantId
                },

                shippingCosts: {
                    baseUrl: 'https://' + apiPath + '/hybris/shippingcost/v1/' + tenantId
                },

                shippingZones: {
                    baseUrl: 'https://' + apiPath + '/hybris/shipping/v1/' + tenantId
                },

                siteSettings: {
                    baseUrl: 'https://' + apiPath + '/hybris/site/v1/' + tenantId
                },

                indexing: {
                    baseUrl: 'https://' + apiPath + '/hybris/search-algolia/v1/' + tenantId
                },

                colorAffinity: {
                    baseUrl: 'https://' + apiPath + '/demos/product-color-profile/v1/' + tenantId
                }
            };

            this.schemas = {
                noteMixinMetadata: 'https://api.yaas.io/hybris/schema/v1/hybriscommerce/cart-item-note-1.0.0'
            };

            this.$get = ['appConfig',
                function (appConfig) {
                    return new SiteConfigSvcProvider(appConfig);
                }
            ];

        }
    ]);
