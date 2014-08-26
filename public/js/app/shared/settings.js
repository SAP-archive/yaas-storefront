'use strict';

angular.module('ds.shared')


	/**
	 * Provides default settings (constants) for the application.
	 * 
	 * @type {Object}
	 */
	.constant('settings', {

        cartTenant: 'single', // temp workaround Priceless issue with hard-coded tenant id

        hybrisUser: 'Anonymous',
        hybrisApp: 'y_ondemand_storefront',
        roleSeller: 'seller',

        // defines thea API endpoints and routes
        apis: {

            configuration: {
               baseUrl: 'http://configuration-v2.test.cf.hybris.com'
            } ,
            products: {
                baseUrl: 'http://product-v1-4-1.test.cf.hybris.com',
                pageSize: 10
            },

            productDetails: {
                baseUrl: 'http://product-details-v1.test.cf.hybris.com'
            },

            checkout: {
                baseUrl: 'http://checkout-mashup-v1.test.cf.hybris.com'
            },

            orders: {
                baseUrl: 'http://order-v1.test.cf.hybris.com'
            },

            cartItems: {
                baseUrl: 'http://cart-v1.test.cf.hybris.com'
            },

            cart: {
                baseUrl: 'http://cart-v1.test.cf.hybris.com'
            },

            cartDetails: {
                baseUrl: 'http://cart-mashup-v1.test.cf.hybris.com'
            },

            prices: {
                baseUrl: 'http://price-v1.test.cf.hybris.com'
            },

            shippingCosts: {
                baseUrl: 'http://shipping-cost-v1.test.cf.hybris.com'
            },

            // header keys
            headers: {

                // "final" headers for CaaS auth.
                // will be replaced by full oauth flow.
                hybrisTenant: 'hybris-tenant',
                hybrisRoles: 'hybris-roles',
                hybrisUser: 'hybris-user',
                hybrisApp: 'hybris-app',
                language:  'accept-language',
                paging: {
                    total: 'X-Count'
                }
            }
        },
        // relevant keys from configuration service:
        configKeys: {
            stripeKey: 'payment.stripe.key.public',
            storeName: 'store.settings.name',
            storeLogo: 'store.settings.image.logo.url'
        },

        placeholderImage: 'img/no-image.png'
    });