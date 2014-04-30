'use strict';

angular.module('ds.products')
    .controller('BrowseProductsCtrl', [ '$scope', 'ProductSvc', 'GlobalData', function ($scope, ProductSvc, GlobalData) {


        $scope.pageSize = 12;
        $scope.pageNumber = 1;
        $scope.sort = 'default'; // no sorting - pagination is off and infinite scroll is turned on
        $scope.products = [];
        $scope.total = GlobalData.products.meta.total;
        $scope.productsFrom = 1;
        $scope.productsTo = $scope.pageSize;

        $scope.addMore = function () {

            // if sorting is turned off, infinite scroll is turned on ---
            if ($scope.sort === 'default') {
                ProductSvc.queryWithResultHandler({pageNumber: $scope.pageNumber++, pageSize: $scope.pageSize},
                    function (products) {
                        if (products) {
                            $scope.products = $scope.products.concat(products);
                            $scope.productsFrom = 1;
                            $scope.productsTo = $scope.products.length;
                            $scope.total = GlobalData.products.meta.total;
                        }
                    });
            }
        };

        // trigger initial load of items
        $scope.addMore();

        var getProducts = function () {
            var products = ProductSvc.query({pageNumber: $scope.pageNumber, pageSize: $scope.pageSize, sort: $scope.sort});
            products.$promise.then(function(products) {
                $scope.productsFrom = (($scope.pageNumber-1) * $scope.pageSize)+ 1;
                $scope.productsTo = $scope.pageNumber * $scope.pageSize;
            });
            return products;
        };

        $scope.backToTop = function () {
            window.scrollTo(0, 0);
        };


        $scope.setSortedPage = function (pageNo) {
            $scope.pageNumber = pageNo;
            $scope.products = getProducts();
        };

        $scope.showRefineContainer = function () {
            $scope.refineContainerShowing = !$scope.refineContainerShowing;
        };

    }]);
