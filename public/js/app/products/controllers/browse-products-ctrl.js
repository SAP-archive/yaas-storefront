'use strict';

angular.module('ds.products', ['ui.bootstrap'])
    .controller('BrowseProductsCtrl', [ '$scope', 'ProductSvc', function($scope, ProductSvc) {

    $scope.pageNumber = ($scope.pageNumber || 1);

    $scope.sort = 'sort';

    function getProducts(){
        return ProductSvc.query({pageNumber: $scope.pageNumber, pageSize: 12, sort: $scope.sort});

    }

    $scope.products = getProducts();

    $scope.showProducts = function(){
        $scope.products = getProducts($scope.pageNumber = 1);

    };

    $scope.addMore = function (){
        if ($scope.sort === 'sort'){
        getProducts({pageNumber: ++$scope.pageNumber, pageSize: 12 , sort: $scope.sort}).$promise.then(
            function (products) {
                if (products && $scope.sort === 'sort'){
                    $scope.products = $scope.products.concat(products);
                }
            }
        );
    }
    };

    $scope.setPage = function (pageNumber) {
            $scope.products = getProducts({pageNumber: $scope.pageNumber, pageSize: 12 , sort: $scope.sort});
    };

}]);
