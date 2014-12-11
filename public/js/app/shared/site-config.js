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
            var dynamicDomain = /*StartDynamicDomain*/ 'api.yaas.io' /*EndDynamicDomain*/;

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
                    baseUrl: 'https://' + dynamicDomain + '/price/v3/' + tenantId
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
