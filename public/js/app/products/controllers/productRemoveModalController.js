'use strict';

angular.module('hybris.bs&d.newborn.products.controllers.productremovemodal', [])
	.controller('ProductRemoveModalCtrl', ['$scope', '$modalInstance', 'product',
		function ($scope, $modalInstance, product) {

			$scope.product = product;

			$scope.ok = function () {
				$modalInstance.close(product);
			};

			$scope.cancel = function () {
				$modalInstance.dismiss('cancel');
			};

		}
	]);