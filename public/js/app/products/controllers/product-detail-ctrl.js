'use strict';

angular.module('ds.products')
   .controller('ProductDetailCtrl', [ '$scope', 'product', function($scope, product) {
   $scope.product = product;

}]);
