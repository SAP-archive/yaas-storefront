'use strict';

angular.module('ds.products')
   .controller('BrowseProductsCtrl', [ '$scope', 'products', function($scope, products) {
   $scope.products = products;

}]);
