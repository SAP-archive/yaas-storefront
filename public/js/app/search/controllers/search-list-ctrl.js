/**
 * [y] hybris Platform
 *
 * Copyright (c) 2000-2015 hybris AG
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of hybris
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with hybris.
 */



'use strict';

angular.module('ds.searchlist')
    .controller('SearchListCtrl', ['$scope', '$rootScope', 'ProductSvc', 'GlobalData', 'settings', '$state', '$location', '$timeout', '$anchorScroll', 'ysearchSvc', 'searchString', 'MainMediaExtractor', 'PriceSvc', '$q',
        function ($scope, $rootScope, ProductSvc, GlobalData, settings, $state, $location, $timeout, $anchorScroll, ysearchSvc, searchString, MainMediaExtractor, PriceSvc, $q) {

            $scope.searchString = searchString;

            $scope.pageSize = GlobalData.products.pageSize;
            $scope.pageNumber = 0;
            $scope.setSortedPageSize = void 0;
            $scope.setSortedPageNumber = 1;
            $scope.total = GlobalData.products.meta.total;
            $scope.store = GlobalData.store;
            $scope.products = [];
            $scope.prices = {};
            $scope.requestInProgress = false;
            $scope.PLACEHOLDER_IMAGE = settings.placeholderImage;
            $scope.sortParams = GlobalData.getSearchRefinements();
            $scope.sort = { selected: GlobalData.getSearchRefinements()[0].id };
            $scope.currencySymbol = GlobalData.getCurrency();

            $scope.pagination = {
                productsFrom: 1,
                productsTo: 1
            };

            //Initialization of algolia
            ysearchSvc.init();

            $scope.loadedPages = 1;
            $scope.loadMorePages = false;

            function getProductIdsFromAssignments(assignments) {

                return assignments.map(function (assignment) {
                    return assignment.objectID;
                });
            }

            function setMainImage(product) {
                var mainMedia = MainMediaExtractor.extract(product.media);
                if (mainMedia) {
                    product.mainImageURL = mainMedia.url;
                }
            }

            function assignMainImage(products) {
                angular.forEach(products, function (product) {
                    setMainImage(product);
                });
            }

            function queryProducts(query, concat) {
                $scope.requestInProgress = true;
                ProductSvc.queryProductList(query)
                    .then(function getProducts(products) {
                        $scope.requestInProgress = false;
                        if (products) {
                            if (concat) {
                                $scope.products = $scope.products.concat(products);
                            } else {
                                $scope.products = products;
                            }
                            if ($scope.products.length === 0) {
                                $scope.pagination.productsFrom = 0;
                            }

                            var variantsPromises = [];
                            var promise;
                            if (products.length) {
                                assignMainImage(products);
                                angular.forEach(products, function (product) {
                                    if (product.metadata &&
                                        product.metadata.variants &&
                                        product.metadata.variants.options &&
                                        Object.keys(product.metadata.variants.options).length > 0) {
                                        promise = ProductSvc.getProductVariants({ productId: product.id })
                                            .then(function (result) {
                                                product.hasVariants = result.length > 0;
                                            });
                                        variantsPromises.push(promise);
                                    } else {
                                        product.hasVariants = false;
                                    }
                                });
                            }

                            //Set page parameter
                            $location.search('page', $scope.pageNumber).replace();

                            return $q.all(variantsPromises);
                        }
                    }, function () {
                        $scope.requestInProgress = false;
                    })
                    .then(function getPrices() {

                        PriceSvc.getPricesMapForProducts($scope.products, GlobalData.getCurrencyId())
                            .then(function (prices) {
                                $scope.prices = prices;
                            });

                        if ($scope.loadMorePages) {
                            $timeout(function () {
                                $scope.pageSize = $scope.pageSize / $scope.loadedPages;
                                $scope.pageNumber = $scope.loadedPages;

                                //Scroll to the page
                                if (!!$scope.products[$scope.pageSize * ($scope.loadedPages - 1)]) {
                                    $scope.scrollTo('p_' + $scope.products[$scope.pageSize * ($scope.loadedPages - 1)].id);
                                }

                                //Try scrolling to the last element
                                $scope.scrollTo('p_' + GlobalData.products.lastViewedProductId);

                                //Set page parameter
                                $location.search('page', $scope.pageNumber).replace();

                                $scope.loadMorePages = false;
                            }, 1);
                        }

                        //Send event that search is done
                        $rootScope.$emit('search:performed', { searchTerm: $scope.searchString, numberOfResults: $scope.total });

                        $scope.requestInProgress = false;
                    }, function () {
                        $scope.requestInProgress = false;
                    });
            }

            function getProducts(ids) {
                //we only want to show published products on this list
                var qSpec = 'published:true';
                qSpec = qSpec + ' ' + 'id:(' + ids + ')';
                var query = {
                    sort: $scope.sort.selected,
                    q: qSpec
                };
                queryProducts(query, true);
            }


            $scope.addMore = function () {

                // prevent additional API calls if all products are retrieved
                // infinite scroller initiates lots of API calls when scrolling to the bottom of the page
                if (!GlobalData.products.meta.total || $scope.products.length < GlobalData.products.meta.total) {
                    if (!$scope.requestInProgress) {
                        $scope.pageNumber = $scope.pageNumber + 1;

                        $scope.requestInProgress = true;

                        var page = $scope.pageNumber;

                        ysearchSvc.getResults($scope.searchString, { hitsPerPage: $scope.pageSize, page: page - 1 })
                            .then(function (content) {

                                GlobalData.products.meta.total = content.nbHits;
                                $scope.total = content.nbHits;

                                $scope.lastPageNumber = Math.ceil(content.nbHits / $scope.pageSize);

                                if (content.hits.length > 0) {
                                    var ids = getProductIdsFromAssignments(content.hits);

                                    getProducts(ids);
                                }

                            }, function () {
                                $scope.requestInProgress = false;
                            });

                    }
                }
            };

            $scope.backToTop = function () {
                window.scrollTo(0, 0);
            };

            $scope.scrollTo = function (id) {

                // always scroll by 150 extra pixels (because of the navigation pane)
                $anchorScroll.yOffset = 150;

                //Then try scrolling to the element
                var old = $location.hash();
                $location.hash(id);
                $anchorScroll();
                $location.hash(old);
            };

            //Check for query parameter that has the number of pages
            if (!!$location.search().page) {
                $scope.loadedPages = parseInt($location.search().page);
                $scope.pageSize = $scope.pageSize * $scope.loadedPages;
                $scope.sort = GlobalData.products.lastSort || { selected: '' };
                $scope.loadMorePages = true;
            }

            // trigger initial load of items
            $scope.addMore();

            //Save id of the last viewed element, last viewed page and current sort
            $scope.openProductDetails = function (productId) {
                GlobalData.products.lastViewedProductId = productId;
                GlobalData.products.lastSort = $scope.sort;
            };

            $scope.showRefineContainer = function () {
                $scope.refineContainerShowing = !$scope.refineContainerShowing;
            };

        }]);

