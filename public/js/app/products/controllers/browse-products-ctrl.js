'use strict';

angular.module('ds.products')
    /** Controller for the 'browse products' view.  */
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

        /** Retrieves pricing information for the list of products.
         * @param products JSON product list response
         */
        function getPrices(products) {
            var productIds = products.map(function (product) {
                return product.id;
            });
            var queryPrices = {
                q: 'productId:(' + productIds + ')'
            };

            PriceSvc.query(queryPrices).$promise.then(
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
        };

        /*
          Retrieves more products from the product service and adds them to the product list.
          This function is only for infinite scrolling, which is the default state.  It is disabled once a sort is applied.
         */
        $scope.addMore = function () {

            if ($scope.sort === '') {
                var query = {
                    pageNumber: $scope.pageNumber++,
                    pageSize: $scope.pageSize,
                    //we only want to show published products on this list
                    q: 'published:true'
                };

                // prevent additional API calls if all products are retrieved
                // infinite scroller initiates lots of API calls when scrolling to the bottom of the page
                if (!GlobalData.products.meta.total || $scope.products.length < GlobalData.products.meta.total) {
                    ProductSvc.query(query).$promise.then(

                        function (products) {
                            if (products) {
                                $scope.products = $scope.products.concat(products);
                                $scope.productsTo = $scope.products.length;
                                if ($scope.productsTo > $scope.total && $scope.total !== 0) {
                                    $scope.productsTo = $scope.total;
                                }
                                $scope.total = GlobalData.products.meta.total;
                                getPrices(products);
                            }
                        });
                }
            }
        };

        // trigger initial load of items for infinite scroll
        $scope.addMore();



        /** Recalculates the "viewing x to z products" numbers. */
       function getViewingNumbers (pageNo) {
            $scope.productsFrom = $scope.pageSize * pageNo - $scope.pageSize + 1;
            $scope.productsTo = $scope.pageSize * pageNo;

            if ($scope.productsTo > $scope.total && $scope.total !== 0) {
                $scope.productsTo = $scope.total;
            }
        };

        /** Retrieves and displays the products selected via the pagination widget.
         * Only shown once the sort option is applied.
         */
        $scope.setSortedPage = function (pageNo) {

            if ($scope.sort && $scope.sort !== '') {
                if (($scope.pageSize > $scope.total) && ($scope.total !== 0)) {
                    $scope.pageSize = $scope.total;
                }

                getViewingNumbers(pageNo);
                $scope.pageNumber = pageNo;

                var query = {
                    pageNumber: $scope.pageNumber,
                    pageSize: $scope.pageSize,
                    sort: $scope.sort,
                    //we only want to show published products on this list
                    q: 'published:true'
                };

                ProductSvc.query(query).$promise.then(
                    function (products) {
                        if (products) {
                            $scope.products = products;
                            $scope.total = GlobalData.products.meta.total;
                            getPrices(products);
                        }
                    });
            }
        };

        $scope.showRefineContainer = function () {
            $scope.refineContainerShowing = !$scope.refineContainerShowing;
        };

        /** Scrolls browser window to top left of page.*/
        $scope.backToTop = function () {
            window.scrollTo(0, 0);
        };

    }]);
