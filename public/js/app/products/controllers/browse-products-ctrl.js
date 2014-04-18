'use strict';

angular.module('ds.products', ['ui.bootstrap'])
    .controller('BrowseProductsCtrl', [ '$scope', 'ProductSvc', function($scope, ProductSvc) {


    $scope.pageSize = 12;
    $scope.pageNumber = 1;
    $scope.sort = 'default'; // no sorting - pagination is off and infinite scroll is turned on

    var getProducts = function() {
        return ProductSvc.query({pageNumber: $scope.pageNumber, pageSize: $scope.pageSize, sort: $scope.sort});
    };

    $scope.products = getProducts();


    $scope.addMore = function (){
        // if sorting is turned off, infinite scroll is turned on ---
        if ($scope.sort === 'default'){
            ++$scope.pageNumber;
            ProductSvc.queryWithResultHandler( {pageNumber: $scope.pageNumber, pageSize: $scope.pageSize},
                function (products) {
                    if (products){
                        $scope.products = $scope.products.concat(products);
                    }
            });
        }
    };


    $scope.setSortedPage = function (pageNo) {
        $scope.pageNumber = pageNo;
        $scope.products = getProducts();
    };

}]);
