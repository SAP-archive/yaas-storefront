'use strict';

angular.module('ds.products')
    .controller('BrowseProductsCtrl', [ '$scope', 'ProductSvc', 'PriceSvc', 'GlobalData', function ($scope, ProductSvc, PriceSvc, GlobalData) {


        $scope.pageSize = 8;
        $scope.pageNumber = 1;
        $scope.sort = '';
        $scope.products = [];
        $scope.total = GlobalData.products.meta.total;
        $scope.productsFrom = 1;
        $scope.productsTo = $scope.pageSize;
        $scope.store = GlobalData.store;
        $scope.prices = {};

        $scope.addMore = function () {
            /*
                this function is only for infinite scrolling, which is disabled when a sort is applied.
             */
            if ($scope.sort === '') {
                var query = {
                    pageNumber: $scope.pageNumber++,
                    pageSize: $scope.pageSize
                };

                if ($scope.sort) {
                    query.sort = $scope.sort;
                }

                //we only want to show published products on this list
                query.q = 'published:true';

                // prevent additional API calls if all products are retrieved
                // infinite scroller initiates lots of API calls when scrolling to the bottom of the page
                if (!GlobalData.products.meta.total || $scope.products.length < GlobalData.products.meta.total) {
                    ProductSvc.queryWithResultHandler(query,
                        function (products) {
                            if (products) {
                                $scope.products = $scope.products.concat(products);
                                $scope.productsTo = $scope.products.length;
                                $scope.total = GlobalData.products.meta.total;
                                var productIds = products.map(function (product) {
                                    return product.id;
                                });
                                var queryPrices = {
                                    q: 'productId:(' + productIds + ')'
                                };

                                PriceSvc.queryWithResultHandler(queryPrices,
                                    function (pricesResponse) {
                                        if (pricesResponse) {
                                            var prices = pricesResponse.prices;
                                            var pricesMap = {};

                                            prices.forEach(function (price) {
                                                pricesMap[price.productId] = price;
                                            });

                                            $scope.prices = angular.extend($scope.prices, pricesMap);
                                        }
                                    }
                                );
                            }
                        });
                }
            }
        };

        // trigger initial load of items
        $scope.addMore();

        $scope.backToTop = function () {
            window.scrollTo(0, 0);
        };

        $scope.getViewingNumbers = function (pageNo) {
            $scope.productsFrom = $scope.pageSize * pageNo - $scope.pageSize + 1;
            $scope.productsTo = $scope.pageSize * pageNo;
        };

        $scope.setSortedPage = function (pageNo) {

            if (($scope.pageSize > $scope.total) && ($scope.total !== 0)) {
                $scope.pageSize = $scope.total;
            }

            $scope.getViewingNumbers(pageNo);
            $scope.pageNumber = pageNo;
            var query = {
                pageNumber: $scope.pageNumber,
                pageSize: $scope.pageSize,
                sort: $scope.sort
            };

            //we only want to show published products on this list
            query.q = 'published:true';

            $scope.products = ProductSvc.query(query);
        };

        $scope.showRefineContainer = function () {
            $scope.refineContainerShowing = !$scope.refineContainerShowing;
        };

    }]);
