'use strict';

angular.module('ds.products')
    .controller('BrowseProductsCtrl', [ '$scope', 'ProductSvc', function ($scope, ProductSvc) {

        $scope.pageNumber = ($scope.pageNumber || 1);
        $scope.products = ProductSvc.query({pageNumber: $scope.pageNumber, pageSize: 5});

        $scope.addMore = function () {
            ProductSvc.query({pageNumber: ++$scope.pageNumber, pageSize: 5}, function (products) {
                    if (products) {
                        $scope.products = $scope.products.concat(products);
                    }
                }

            );
        };

    }]);
