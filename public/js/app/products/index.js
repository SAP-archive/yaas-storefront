'use strict';

angular.module('hybris.bs&d.newborn.products', [
        'ui.bootstrap',
		'hybris.bs&d.newborn.products.services.products',
		'hybris.bs&d.newborn.products.controllers.products',
		'hybris.bs&d.newborn.products.controllers.product',
		'hybris.bs&d.newborn.products.controllers.remove',
		'hybris.bs&d.newborn.products.controllers.productremovemodal',
		'hybris.bs&d.newborn.products.controllers.producttabs'
	])

	.factory('errorsHttpInterceptor', ['$q', '$log',
		function ($q, $log) {

			return {
				response: function(response) {
					$log.debug('success with status ' + response.status);
					return response || $q.when(response);
				},
				responseError: function(rejection) {
					$log.debug('error with status ' + rejection.status + ' and data: ' + rejection.data.message);
					switch (rejection.status) {
					case 403:
						console.log('You don\'t have the right to do this');
						break;
					case 0:
						console.log('No connection, internet is down?');
						break;
					default:
						console.log(rejection.data.message);
					}
					return $q.reject(rejection);
				}
			};

		}
	])

	.config(['$httpProvider', function($httpProvider)  {
		return $httpProvider.interceptors.push('errorsHttpInterceptor');
	}]);