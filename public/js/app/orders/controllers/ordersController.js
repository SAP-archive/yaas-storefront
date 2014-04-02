'use strict';

angular.module('hybris.bs&d.newborn.orders.controllers.orders', [])
	.controller('OrdersCtrl', ['$scope', 'Orders', 'settings', 'cart', 'orders', '$state',
		function ($scope, Orders, settings, cart, orders, $state) {

			var refresh = function() {
				$state.reload();
			};

			$scope.orders = orders;
			$scope.modulePath = settings.apis.orders.modulePath;

			$scope.createOrder = function() {
				Orders.createOrder(cart.serialize()).then(function() {
					refresh();
					cart.clear();
				});
			};

			var refreshOrdersHandler = $scope.$on('orders:refresh', refresh);

			$scope.$on('$destroy', function() {
				refreshOrdersHandler();
			});

	}]);