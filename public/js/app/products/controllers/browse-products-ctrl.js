'use strict';

angular.module('ds.products', ['infinite-scroll', 'yng.core'])
   .controller('BrowseProductsCtrl', [ '$scope', 'products', 'caas', function($scope, products, caas) {
   
   $scope.products = products;

          $scope.addMore = function(pageSize, pageNumber){
                caas.products.API.query({pagesize: pageSize, pageNumber: ++$scope.pageNumber}).$promise.then(
                    function (products) {
                        if (products.products){
                            $scope.products = $scope.products.concat(products.products);
                        }
                    }
                );
            };

}]);
