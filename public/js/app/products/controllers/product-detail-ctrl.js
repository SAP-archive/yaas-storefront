'use strict';

angular.module('ds.products')
    .controller('ProductDetailCtrl', [ '$state', '$scope', '$rootScope', 'CartSvc', 'product',
        function($state, $scope, $rootScope, CartSvc, product) {


            $scope.product = product;

            //input default values must be defined in controller, not html, if tied to ng-model
            $scope.productDetailQty = 1;

            var unbind = $rootScope.$on('cart:updated', function () {
                $rootScope.showCart = true;
            });

            $scope.$on('$destroy', unbind);

            $scope.addToCartFromDetailPage = function () {
                CartSvc.addProductToCart(product, $scope.productDetailQty);
            };

}]);