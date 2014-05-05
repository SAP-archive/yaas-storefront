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
        authorizationId: 'polo_auth',
        buyerId: 'buyer@example.com',
        orderMashupTenantId: 'me@example.com',
        orderMashupUser: 'me',

        apis: {

            products: {
                baseUrl: 'http://product-service-dprod.deis-dev-01.ytech.fra.hybris.com',

                route: '/products/:productSku',
                pageSize: 10
            },

            orders: {
                baseUrl: 'http://order-service-dprod.deis-dev-01.ytech.fra.hybris.com',
                route: '/orders/:orderId'
            },

            orderDetails: {
                baseUrl: 'http://order-mashup-service.dprod.cf.hybris.com',
                route: '/order/details/:orderDetailId'
            },

            headers: {
                tenant: 'X-tenantId',
                authorization: 'Authorization',
                customer: 'X-buyerId',
                paging: {
                    total: 'X-count'
                },
                mashupTenant: 'hybris-tenantId',
                mashupUser: 'hybris-user'
            }
        }
    });