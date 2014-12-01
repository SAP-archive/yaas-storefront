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

            var stId = '';

            // handle dynamic tenant data.
            if(!_.isEmpty(storeConfig) && !_.isEmpty(storeConfig.storeTenant)) {
                stId = storeConfig.storeTenant;
            }

            this.apis = {

                account: {
                    baseUrl: 'https://yaas-test.apigee.net/test/account/v1',
                    addresses: {
                        initialPageSize: 6
                    }
                },

                cart: {
                    baseUrl: 'https://yaas-test.apigee.net/test/cart/v4/' + stId
                },

                categories: {
                    baseUrl: 'https://yaas-test.apigee.net/test/category/v2/' + stId
                },

                checkout: {
                    baseUrl: 'https://yaas-test.apigee.net/test/checkout-mashup/v4/' + stId
                },

                configuration: {
                    baseUrl: 'https://yaas-test.apigee.net/test/configuration/v4/' + stId
                } ,

                customers: {
                    baseUrl: 'https://yaas-test.apigee.net/test/customer/v5/' + stId
                },

                orders: {
                    baseUrl: 'https://yaas-test.apigee.net/test/order/v3/' + stId
                },

                prices: {
                    baseUrl: 'https://yaas-test.apigee.net/test/price/v3/' + stId
                },

                products: {
                    baseUrl: 'https://yaas-test.apigee.net/test/product/v3/' + stId,
                    pageSize: 10
                },

                productDetails: {
                    baseUrl: 'https://yaas-test.apigee.net/test/product-details/v3/' + stId
                },

                shippingCosts: {
                    baseUrl: 'https://yaas-test.apigee.net/test/shipping-cost/v3/' + stId
                }
            };

            this.$get = ['storeConfig',
                function(storeConfig) {
                    return new SiteConfigSvcProvider(storeConfig);
                }
            ];

        }
    ]);
