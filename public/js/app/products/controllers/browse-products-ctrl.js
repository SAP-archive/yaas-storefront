'use strict';

angular.module('ds.products', ['infinite-scroll', 'yng.core'])
   .controller('BrowseProductsCtrl', [ '$scope', 'products', 'caas', '$state', '$stateParams', function($scope, products, caas, $stateParams) {
   
   $scope.products = products;
   $scope.pageNumber = ($stateParams.pageNumber || 1);


          $scope.addMore = function(){
                caas.products.API.query({pageSize: 5, pageNumber: ++$scope.pageNumber}).$promise.then(
                    function (products) {
                        if (products){

                            var count=1;
                            var images = ['http://placekitten.com/400/150', 'http://placekitten.com/400/300', 'http://placekitten.com/400/400', 'http://placekitten.com/400/200'];
                            angular.forEach(products, function(product) {
                                product.images[0].url = images[count % 4];
                                product.currency = '$';
                                count++;
                            });
                            $scope.products = $scope.products.concat(products);
                        }
                    }
                );
            };

}]);
