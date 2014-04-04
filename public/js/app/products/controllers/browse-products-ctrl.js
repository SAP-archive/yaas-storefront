'use strict';

angular.module('ds.products', ['infinite-scroll', 'yng.core'])
   .controller('BrowseProductsCtrl', [ '$scope', 'products', 'caas', '$state', '$stateParams', function($scope, products, caas, $stateParams) {
   
   $scope.products = products;
   $scope.pageNumber = ($stateParams.pageNumber || 1);


          $scope.addMore = function(){
                caas.products.API.query({pagesize: 15, pageNumber: ++$scope.pageNumber}).$promise.then(
                    function (products) {
                        if (products.products){
                            $scope.products = $scope.products.concat(products.products);
                        }
                    }
                );
            };

}]);
