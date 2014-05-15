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

        tenantId: 'onlineshop',
        cartTenant: 'single', // temp workaround Priceless issue with hard-coded tenant id
        authorizationId: 'polo_auth',
        buyerId: 'buyer@example.com',

        apis: {

            products: {
                baseUrl: 'http://product-service.staged.cf.hybris.com',

                route: '/products/:productSku',
                pageSize: 10
            },

            orders: {
                baseUrl: 'http://order-service.dprod.cf.hybris.com',
                route: '/orders/:orderId'
            },

            orderDetails: {
                baseUrl: 'http://order-mashup-service.dprod.cf.hybris.com',
                route: '/order/details/:orderId'
            },

            cartItems: {
                baseUrl: 'http://cart-service.dev.cf.hybris.com',
                route:   '/cartItems'
            },

            cart: {
                baseUrl: 'http://cart-service.dev.cf.hybris.com',
                route: '/carts/:cartId'
            },

            cartDetails: {

            },

            headers: {

                tenantOld: 'X-tenantId',

                tenant: 'hybris-tenantId',

                authorization: 'Authorization',
                customer: 'X-buyerId',
                user: 'hybris-user',
                paging: {
                    total: 'X-count'
                }
            }
        }
    });