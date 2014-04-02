'use strict';

angular.module('hybris.bs&d.newborn.products')
	.constant('ProductsConstants', {

		baseUrl: 'http://responsive.hybris.com:9001',
		apiUri: '/rest/v1/apparel-uk',
		apiBaseUrl: function(url) {
			return this.baseUrl + this.apiUri + (url || '');
		}

	});
