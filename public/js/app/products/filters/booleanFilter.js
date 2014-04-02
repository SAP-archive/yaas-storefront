'use strict';

angular.module('hybris.bs&d.newborn.products')
	.filter('boolean',
		function() {
			return function(input) {
				return input ? 'yes' : 'no';
		  };
		}
	);