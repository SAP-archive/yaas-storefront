'use strict';

angular.module('ds.products', ['infinite-scroll', 'yng.core'])
   .controller('BrowseProductsCtrl', [ '$scope', 'caas', '$stateParams', 'settings', function($scope, caas, $stateParams, settings) {

   $scope.products = [];

   $scope.productCount = 0;
   $scope.pageNumber = ($stateParams.pageNumber || 1);

   caas.products.API.query({'pageSize': settings.apis.products.pageSize, 'pageNumber': $scope.pageNumber}).$promise .then(function(result){
       $scope.products = result;
       $scope.productCount = $scope.products.length;
   });



          $scope.addMore = function(){
                caas.products.API.query({pageSize: 5, pageNumber: ++$scope.pageNumber}).$promise.then(
                    function (products) {
                        if (products){
                            $scope.products = $scope.products.concat(products);
                            $scope.productCount = $scope.products.length;
                        }
                    }
                );
            };

}]);
