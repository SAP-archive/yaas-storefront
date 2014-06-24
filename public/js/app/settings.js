'use strict';

angular.module('ds.shared')

	/**
	 * Defaults settings for the application.
	 * This file contains default configuration for the entire application.
	 * 
	 * @type {Object}
	 */
	.constant('settings', {

		// Set default language code for the application
		languageCode: 'en',

        cartTenant: 'single', // temp workaround Priceless issue with hard-coded tenant id

        hybrisUser: 'Anonymous',
        hybrisApp: 'y_ondemand_storefront',
        roleSeller: 'seller',

        apis: {

            configuration: {

               baseUrl: 'http://configuration-v2.test.cf.hybris.com',
               route: '/configurations/:tenant'
            } ,
            products: {
                baseUrl: 'http://product-service.test.cf.hybris.com',
                route: '/products/:productId',
                pageSize: 10
            },

            checkout: {
                baseUrl: 'http://checkout-mashup-v1.test.cf.hybris.com',
                route: '/checkouts/order'
            },

            orders: {
                baseUrl: 'http://order-v1.test.cf.hybris.com',
                route: '/orders/:orderId'
            },

            cartItems: {
                baseUrl: 'http://cart-v1.test.cf.hybris.com',
                route:   '/cartItems'
            },

            cart: {
                baseUrl: 'http://cart-v1.test.cf.hybris.com',
                route: '/carts/:cartId'
            },

            cartDetails: {
                baseUrl: 'http://cart-mashup-v1.test.cf.hybris.com',
                route: '/carts/:cartId/details'
            },

            prices: {
                baseUrl: 'http://price-v1.test.cf.hybris.com',
                route: '/prices'
            },

            headers: {

                // "final" headers for CaaS auth.
                // will be replaced by full oauth flow.
                hybrisTenant: 'hybris-tenant',
                hybrisRoles: 'hybris-roles',
                hybrisUser: 'hybris-user',
                hybrisApp: 'hybris-app',

                paging: {
                    total: 'X-Count'
                }
            }
        },
        // relevant keys from configuration service:
        configKeys: {
            stripeKey: 'payment.stripe.key.public',
            storeName: 'store.settings.name'
        }
    });