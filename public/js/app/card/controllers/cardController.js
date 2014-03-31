'use strict';

angular.module('hybris.bs&d.newborn.card.controllers.card', [])
	.controller('CardCtrl', ['$scope', 'Orders', 'settings', 'Card', 'ProductsConstants', '$state', '$rootScope',
		function ($scope, Orders, settings, Card, ProductsConstants, $state, $rootScope) {

			var setCardScope = function() {
				$scope.card = Card.items();
				$scope.total = Card.total() || 0;
			};
			
			$scope.createOrder = function() {
				Orders.createOrder(Card.serialize()).then(function() {
					Card.clear();
					setCardScope();
					if ($state.is('base.orders')) {
						$rootScope.$broadcast('orders:refresh');
					}
					if ($state.is('base.products.list')) {
						$rootScope.$broadcast('products:refresh');
					}
					$rootScope.$broadcast('orders:order:created');
				});
			};

			$scope.cancelOrder = function() {
				console.log('Sorry fellow, but no canceling is supported!');
			};

			$scope.removeItem = function(citem) {
				Card.removeFromCard(citem.product).then(setCardScope);
			};

			$scope.CONTEXT_ROOT = ProductsConstants.baseUrl;
			setCardScope();
			
			var onCardAddHandle = $scope.$on('card:add', setCardScope);

			$scope.$on('$destroy', function() {
				onCardAddHandle();
			});

	}]);