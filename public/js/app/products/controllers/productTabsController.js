'use strict';

angular.module('hybris.bs&d.newborn.products.controllers.producttabs', [])
	.controller('ProductTabsCtrl', ['$scope', '$stateParams', '$state', 'TabsService',
		function ($scope, $stateParams, $state, TabsService) {

			var tabs = TabsService.getTabs();

			if ($stateParams.productSku && !TabsService.getTab($stateParams.productSku)) {
				var stateName = 'base.products.edit';
				TabsService.addTab({
					id: $stateParams.productSku,
					label: 'Edit Product ' + $stateParams.productSku,
					url: $state.href(stateName, { productSku: $stateParams.productSku  }),
					stateName: stateName,
					stateParams: { productSku: $stateParams.productSku },
					active: $state.is(stateName, { productSku: $stateParams.productSku }),
                    closeable: true
				});
			}

			$scope.removeTab = function(event, tab) {
				event.preventDefault();
				TabsService.removeTab(tab);
			};

			$scope.tabs = tabs;

		}
	]);