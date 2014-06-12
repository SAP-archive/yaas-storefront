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

        //tenantId is now being set by grunt using a generated config.js
        // tenantId: 'onlineshop', 
        cartTenant: 'single', // temp workaround Priceless issue with hard-coded tenant id
        //authorizationId: 'polo_auth',
        //buyerId: 'buyer@example.com',

        hybris_user: 'Anonymous',
        hybris_app: 'y_ondemand_storefront',

        apis: {

            products: {
                baseUrl: 'http://product-service.test.cf.hybris.com',
                route: '/products/:productId',
                pageSize: 10
            },

            checkout: {
                baseUrl: 'http://checkout-mashup-service.dprod.cf.hybris.com',
                route: '/checkouts/order'
            },

            orders: {
                baseUrl: 'http://order--v1.test.cf.hybris.com',
                route: '/orders/:orderId'
            },

            cartItems: {
                baseUrl: 'http://cart-service.dprod.cf.hybris.com',
                route:   '/cartItems'
            },

            cart: {
                baseUrl: 'http://cart-service.dprod.cf.hybris.com',
                route: '/carts/:cartId'
            },

            cartDetails: {

            },

            headers: {

                // "final" headers for CaaS auth.
                // will be replaced by full oauth flow.
                hybris_tenant: 'hybris-tenant',
                hybris_roles: 'hybris-roles',
                hybris_user: 'hybris-user',
                hybris_app: 'hybris-app',

                // old headers
                tenantOld: 'X-tenantId',
                tenant: 'hybris-tenantId',
                //tenant2: 'hybris-tenant',

                //authorization: 'Authorization',
                //customer: 'hybris-buyerId',
                //customerOld: 'X-buyerId',
                //user: 'hybris-user',
                paging: {
                    total: 'X-Count'
                }
            }
        }
    });