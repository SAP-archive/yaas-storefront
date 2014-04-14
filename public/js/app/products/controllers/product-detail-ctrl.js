'use strict';

angular.module('ds.products')
    .controller('ProductDetailCtrl', [ '$scope', '$rootScope', 'CartSvc', 'product', function($scope, $rootScope, CartSvc, product) {

    $scope.product = product;

    $scope.addProductToCart = function () {
        CartSvc.pushProductToRootScope(product);
    };

}]);