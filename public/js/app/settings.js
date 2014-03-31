'use strict';

angular.module('hybris.bs&d.newborn')

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
		buyerId: 'buyer@example.com',
		authorizationId: 'polo_auth',

		apis: {
			orders: {
				modulePath: 'public/js/app/orders/',
				// baseUrl: 'http://127.0.0.1:8100/',
				baseUrl: 'http://order-service-dprod.deis-dev-01.ytech.fra.hybris.com/',
				uri: 'orders/:orderId'
			},
			products: {
				modulePath: 'public/js/app/products/',
				// baseUrl: 'http://product-service-dprod.deis-dev-01.ytech.fra.hybris.com/',
				baseUrl: 'http://product-service-int.deis-dev-01.ytech.fra.hybris.com/',
				// baseUrl: 'http://192.168.145.182:8910/product-service-web-0.1-SNAPSHOT/',
				uri: 'products/:productSku'
			},
			headers: {
				tenant: 'X-tenantId',
				buyer: 'X-buyerId',
				authorization: 'Authorization'
			}
		}

	});