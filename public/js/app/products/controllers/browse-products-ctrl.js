'use strict';

angular.module('ds.products', ['infinite-scroll', 'yng.core'])
   .controller('BrowseProductsCtrl', [ '$scope', 'products', 'caas', '$state', '$stateParams', function($scope, products, caas, $stateParams) {
   
   $scope.products = products;
   $scope.productCount = products.length;
   $scope.pageNumber = ($stateParams.pageNumber || 1);


          $scope.addMore = function(){
                caas.products.API.query({pageSize: 5, pageNumber: ++$scope.pageNumber}).$promise.then(
                    function (products) {
                        if (products){

                            angular.forEach(products, function(product) {
                                // HARD-CODED FOR NOW - API DOES NOT YET SUPPORT
                                product.currency = '$';
                            });
                            $scope.products = $scope.products.concat(products);
                            $scope.productCount = $scope.products.length;
                        }
                    }
                );
            };

}]);
