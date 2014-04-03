'use strict';

angular.module('ds.products', ['infinite-scroll'])
   .controller('BrowseProductsCtrl', [ '$scope', 'products', function($scope, products) {
   $scope.products = products;

          $scope.addMore = function(pageSize){
                products(pageSize, ++$scope.pageNumber).then(
                    function (products) {
                        if (products.products){
                            $scope.products = $scope.products.concat(products.products);
                        }
                    }
                );
            };

}]);
