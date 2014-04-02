'use strict';

angular.module('hybris.bs&d.newborn.products.controllers.product', [
		'hybris.bs&d.newborn.products.services.products'
	])
	.controller('ProductCtrl', ['$scope', 'Products', '$state', '$stateParams', 'product', 'editMode', 'template', '$controller',
		function ($scope, Products, $state, $stateParams, product, editMode, template, $controller) {

			angular.extend(this, $controller('ProductRemoveCtrl', {$scope: $scope}));

			product.addImage();
			$scope.product = product;
			$scope.template = template;
			$scope.editMode = editMode || false;

			$scope.submit = function(product) {
				if (product.isValid()) {
					product.saveOrUpdate(function() {
						$state.go('base.products.list');
					});
				} else {
					$scope.errors = product.errors;
				}
			};

			$scope.addImage = function() {
				product.addImage();
			};

			$scope.removeImage = function(image, index) {
				product.removeImage(index);
				if (product.getImages().length < 1) {
					product.addImage();
				}
			};

		}
	]);