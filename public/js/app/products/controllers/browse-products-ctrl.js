'use strict';

angular.module('ds.products')
    .controller('BrowseProductsCtrl', [ '$scope', 'ProductSvc', function($scope, ProductSvc) {

    $scope.pageNumber = ($scope.pageNumber || 1);

    $scope.sort = 'sort';

    $scope.products = ProductSvc.query({pageNumber: $scope.pageNumber, pageSize: 5, sort: $scope.sort});

    $scope.productFilter = function(){
       $scope.products = ProductSvc.query({pageNumber: $scope.pageNumber, pageSize: 5, sort: $scope.sort});
    };

    $scope.addMore = function(){
        ProductSvc.query({pageNumber: ++$scope.pageNumber, pageSize: 5, sort: $scope.sort}).$promise.then(
            function (products) {
                if (products){
                    $scope.products = $scope.products.concat(products);
                }
            }
        );
    };


}]);
