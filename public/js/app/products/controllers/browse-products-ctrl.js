'use strict';

angular.module('ds.products')
    .controller('BrowseProductsCtrl', [ '$scope', 'ProductSvc', 'GlobalData', function ($scope, ProductSvc, GlobalData) {


        $scope.pageSize = 10;
        $scope.pageNumber = 1;
        $scope.sort = '';
        $scope.products = [];
        $scope.total = GlobalData.products.meta.total;
        $scope.productsFrom = 1;
        $scope.productsTo = $scope.pageSize;

        $scope.addMore = function () {
            var query = {
                pageNumber: $scope.pageNumber++,
                pageSize: $scope.pageSize
            };

            if ($scope.sort) {
                query.sort = $scope.sort;
            }

            // prevent additional API calls if all products are retrieved
            // invfinite scroller initiates lots of API calls when scrolling to the bottom of the page
            if (!GlobalData.products.meta.total || $scope.products.length < GlobalData.products.meta.total) {
                ProductSvc.queryWithResultHandler(query,
                    function (products) {
                        if (products) {
                            $scope.products = $scope.products.concat(products);
                            $scope.productsTo = $scope.products.length;
                            $scope.total = GlobalData.products.meta.total;
                        }
                    });
            }
        };

        // trigger initial load of items
        $scope.addMore();

        $scope.backToTop = function () {
            window.scrollTo(0, 0);
        };


        $scope.setSortedPage = function (pageNo) {
            // $scope.pageNumber = pageNo;
            // $scope.products = getProducts();
            $scope.products = [];
            $scope.pageNumber = pageNo;
            $scope.addMore();
        };

        $scope.showRefineContainer = function () {
            $scope.refineContainerShowing = !$scope.refineContainerShowing;
        };

    }]);
