'use strict';

angular.module('ds.products')
    .controller('ProductDetailCtrl', ['$scope', '$rootScope', 'CartSvc', 'product',
        function($scope, $rootScope, CartSvc, product) {

            $scope.product = product;

            //input default values must be defined in controller, not html, if tied to ng-model
            $scope.productDetailQty = 1;
            $scope.buyButtonEnabled = true;

            var unbind = $rootScope.$on('cart:updated', function () {
                $rootScope.showCart = true;
                $scope.buyButtonEnabled = true;
            });

            $scope.$on('$destroy', unbind);

            $scope.addToCartFromDetailPage = function () {
                $scope.buyButtonEnabled = false;
                CartSvc.addProductToCart(product, $scope.productDetailQty);
            };

}]);