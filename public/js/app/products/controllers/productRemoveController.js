'use strict';

angular.module('hybris.bs&d.newborn.products.controllers.remove', [])
	.controller('ProductRemoveCtrl', ['$scope', '$modal', 'settings', '$state', 'TabsService',
		function ($scope, $modal, settings, $state, TabsService) {

			$scope.remove = function(product) {
				var productSku = product.sku;
				var modalInstance = $modal.open({
					templateUrl: settings.apis.products.modulePath + 'templates/delete_confirmation.html',
					controller: 'ProductRemoveModalCtrl',
					resolve: { product: function () { return product; } }
				});

				modalInstance.result.then(function (productToDelete) {
					setTimeout(function() {
						productToDelete.$delete(function() {
								TabsService.removeTabForState('base.products.edit', { productSku: productSku });
								$state.go('base.products.list', null, { reload: true });
							}, function() {
								console.log('Product delete error ', arguments);
							}
						);
					}, 100);
					
				});
			};

		}
	]);