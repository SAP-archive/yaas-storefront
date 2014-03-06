'use strict';

angular.module('hybris.bs&d.newborn.products.controllers.products', [
		'hybris.bs&d.newborn.products.services.products'
	])
	.controller('ProductsCtrl', ['$scope', 'Products', 'ProductsConstants',
		function ($scope, Products, ProductsConstants) {

			$scope.CONTEXT_ROOT = ProductsConstants.baseUrl;
			$scope.products = Products.API.query();

	}]);