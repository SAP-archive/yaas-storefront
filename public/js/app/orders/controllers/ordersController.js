'use strict';

angular.module('hybris.bs&d.newborn.orders.controllers.orders', [])
	.controller('OrdersCtrl', ['$scope', 'Orders', 'settings', 'Card', 'orders', '$state',
		function ($scope, Orders, settings, Card, orders, $state) {

			var refresh = function() {
				$state.reload();
			};

			$scope.orders = orders;
			$scope.modulePath = settings.apis.orders.modulePath;

			$scope.createOrder = function() {
				Orders.createOrder(Card.serialize()).then(function() {
					refresh();
					Card.clear();
				});
			};

			var refreshOrdersHandler = $scope.$on('orders:refresh', refresh);

			$scope.$on('$destroy', function() {
				refreshOrdersHandler();
			});

	}]);