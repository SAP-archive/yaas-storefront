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

        apis: {

            products: {
                baseUrl: 'http://product-service-dprod.deis-dev-01.ytech.fra.hybris.com',

                route: '/products/:productSku',
                pageSize: 15
            },
            headers: {
                tenant: 'X-tenantId',
                authorization: 'Authorization'
            }
        }


    });