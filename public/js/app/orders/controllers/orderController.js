'use strict';

angular.module('hybris.bs&d.newborn.orders.controllers.order', [])
	.controller('OrderCtrl', ['$scope', 'settings', 'order',
		function ($scope, settings, order) {
			
			$scope.modulePath = settings.apis.orders.modulePath;
			$scope.order = order;

	}]);