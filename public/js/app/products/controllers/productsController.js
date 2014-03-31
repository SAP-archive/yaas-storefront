'use strict';

angular.module('hybris.bs&d.newborn.products.controllers.products', [
        'hybris.bs&d.newborn.products.services.products'
    ])
    .controller('ProductsCtrl', ['$scope', 'Products', 'ProductsConstants', 'Card', 'products', 'template', '$state', '$controller',
        function ($scope, Products, ProductsConstants, Card, products, template, $state, $controller) {

            angular.extend(this, $controller('ProductRemoveCtrl', {$scope: $scope}));

            $scope.template = template;
            $scope.CONTEXT_ROOT = ProductsConstants.baseUrl;
            $scope.products = products;
            $scope.quantity = 0;
            $scope.card = Card;

            $scope.addToCard = function(product, quantity) {
                quantity = parseInt(quantity, 10) || 1;
                Card.addToCard(product, quantity);
            };

            $scope.removeFromCard = function(product) {
                Card.removeFromCard(product);
                product.quantity = 0;
            };
            
            $scope.isInCard = function(product) {
                return !!Card.getItem(product.sku);
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