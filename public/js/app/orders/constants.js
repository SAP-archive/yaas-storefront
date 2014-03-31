'use strict';

angular.module('hybris.bs&d.newborn.orders')
	.constant('OrderConstants', {

		status: {
			// Initial status of a newly created order
			CREATED: 'CREATED',
			// Status of a seller-confirmed order
			CONFIRMED: 'CONFIRMED',
			// Status of a seller-declined order
			DECLINED: 'DECLINED',
			// Status of a successfully shipped order
			COMPLETED: 'COMPLETED'
		}

	});
