'use strict';

angular.module('hybris.bs&d.newborn.cart.controllers.cart', [])
	.controller('cartCtrl', ['$scope', 'Orders', 'settings', 'cart', 'ProductsConstants', '$state', '$rootScope',
		function ($scope, Orders, settings, cart, ProductsConstants, $state, $rootScope) {

			var setcartScope = function() {
				$scope.cart = cart.items();
				$scope.total = cart.total() || 0;
			};
			
			$scope.createOrder = function() {
				Orders.createOrder(cart.serialize()).then(function() {
					cart.clear();
					setcartScope();
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
				cart.removeFromcart(citem.product).then(setcartScope);
			};

			$scope.CONTEXT_ROOT = ProductsConstants.baseUrl;
			setcartScope();
			
			var oncartAddHandle = $scope.$on('cart:add', setcartScope);

			$scope.$on('$destroy', function() {
				oncartAddHandle();
			});

	}]);