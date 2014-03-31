'use strict';

angular.module('hybris.bs&d.newborn.products.controllers.products', [
        'hybris.bs&d.newborn.products.services.products'
    ])
    .controller('ProductsCtrl', ['$scope', 'Products', 'ProductsConstants', 'cart', 'products', 'template', '$state', '$controller',
        function ($scope, Products, ProductsConstants, cart, products, template, $state, $controller) {

            angular.extend(this, $controller('ProductRemoveCtrl', {$scope: $scope}));

            $scope.template = template;
            $scope.CONTEXT_ROOT = ProductsConstants.baseUrl;
            $scope.products = products;
            $scope.quantity = 0;
            $scope.cart = cart;

            $scope.addTocart = function(product, quantity) {
                quantity = parseInt(quantity, 10) || 1;
                cart.addTocart(product, quantity);
            };

            $scope.removeFromcart = function(product) {
                cart.removeFromcart(product);
                product.quantity = 0;
            };
            
            $scope.isIncart = function(product) {
                return !!cart.getItem(product.sku);
            };

            $scope.toggleDetails = function(product) {
                product.showDetails = !product.showDetails;
                // TODO: perform details fetching...
            };

            $scope.submit = function(product) {
                console.log('CTRL submit(', product, ')');
            };

            $scope.edit = function(product) {
                $state.go('base.products.edit', { productSku: product.sku });
            };

            var resetQuantity = function() {
                angular.forEach($scope.products.products, function(product) {
                    product.quantity = 0;
                });
            };

            var onProductsRefreshHandler = $scope.$on('products:refresh', resetQuantity);

            $scope.$on('$destroy', function() {
                onProductsRefreshHandler();
            });
    }]);