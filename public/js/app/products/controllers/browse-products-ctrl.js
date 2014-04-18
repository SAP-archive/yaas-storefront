'use strict';

angular.module('ds.products', ['ui.bootstrap'])
    .controller('BrowseProductsCtrl', [ '$scope', 'ProductSvc', function($scope, ProductSvc) {


    $scope.pageSize = 5;
    $scope.pageNumber = 1;
    $scope.sort = 'sort';

    function getProducts(){
        return ProductSvc.query({pageNumber: $scope.pageNumber, pageSize: $scope.pageSize, sort: $scope.sort});

    }

    $scope.products = getProducts();

    $scope.showProducts = function(){
        $scope.pageNumber = 1;
        $scope.products = getProducts();
    };

    $scope.addMore = function (){
        if ($scope.sort === 'sort'){
            ++$scope.pageNumber;
        getProducts().$promise.then(
            function (products) {
                if (products && $scope.sort === 'sort'){
                    $scope.products = $scope.products.concat(products);
                }
            }
        );
    }
    };



    $scope.setPage = function (pageNo) {

        $scope.pageNumber = pageNo;
        $scope.products = getProducts();
        //console.log('page nbr is '+$scope.pageNumber);
    };

}]);
