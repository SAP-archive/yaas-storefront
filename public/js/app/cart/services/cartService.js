'use strict';

angular.module('hybris.bs&d.newborn.cart.services.cart', [])
    .service('cart', ['$rootScope', '$q',
		function cart($rootScope, $q) {

			var items = null;

			this.items = function() {
				return items;
			};

			this.getItem = function(productCode) {
				return items && items[productCode];
			};

			this.addTocart = function(product, quantity) {
				items = items || {};
				if (!product.sku) {
					throw new Error('product.sku not found!');
				}
				items[product.sku] = {
					product: product,
					quantity: quantity || 0
				};
				$rootScope.$broadcast('cart:add', this);
			};

			this.removeFromcart = function(product) {
				var deferred = $q.defer();
				if (!product.sku) {
					deferred.reject('product.sku not found!');
					throw new Error('product.sku not found!');
				}
				if (items[product.sku]) {
					delete items[product.sku];
					if (angular.equals(items, {})) {
						items = null;
					}
					deferred.resolve();
				}
				return deferred.promise;
			};

			this.clear = function() {
				angular.forEach(items, function(citem, cikey) {
					delete items[cikey];
				});
				items = null;
			};

			this.total = function() {
				var total = 0;
				angular.forEach(items, function(item) {
					total += parseInt(item.quantity, 10) * parseFloat(item.product.price);
				});
				return total.toFixed(2);
			};

			this.serialize = function() {
				var itemsJson = [];

				angular.forEach(items, function(cartItem) {
					itemsJson.push({
							amount: cartItem.quantity,
							productCode: cartItem.product.sku,
							unitPrice: cartItem.product.price
						});
				});

				return itemsJson;
			};

		}
    ]);
