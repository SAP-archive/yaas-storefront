'use strict';

angular.module('ds.products')
    .controller('BrowseProductsCtrl', [ '$scope', 'ProductSvc', function ($scope, ProductSvc) {


        $scope.pageSize = 12;
        $scope.pageNumber = 1;
        $scope.sort = 'default'; // no sorting - pagination is off and infinite scroll is turned on
        $scope.products = [];

        $scope.addMore = function () {

            // if sorting is turned off, infinite scroll is turned on ---
            if ($scope.sort === 'default') {
                ProductSvc.queryWithResultHandler({pageNumber: $scope.pageNumber++, pageSize: $scope.pageSize},
                    function (products) {
                        if (products) {
                            $scope.products = $scope.products.concat(products);
                        }
                    });
            }
        };

        // trigger initial load of items
        $scope.addMore();

        var getProducts = function () {
            return ProductSvc.query({pageNumber: $scope.pageNumber, pageSize: $scope.pageSize, sort: $scope.sort});
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
