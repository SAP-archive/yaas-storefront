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
    .controller('SearchListCtrl', ['$scope', '$rootScope', 'ProductSvc', 'GlobalData', 'settings', '$state', '$location', '$timeout', '$anchorScroll', 'ysearchSvc', 'searchString',
        function ($scope, $rootScope, ProductSvc, GlobalData, settings,  $state, $location, $timeout, $anchorScroll, ysearchSvc, searchString) {

            $scope.searchString = searchString;

            $scope.pageSize = GlobalData.products.pageSize;

            $scope.pageNumber = 0;
            $scope.setSortedPageSize = void 0;
            $scope.setSortedPageNumber = 1;
            $scope.sort = 'mostRelevant';
            $scope.products = [];
            $scope.total = GlobalData.products.meta.total;
            $scope.store = GlobalData.store;
            $scope.prices = {};
            $scope.requestInProgress = false;
            $scope.PLACEHOLDER_IMAGE = settings.placeholderImage;

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

            $scope.currencySymbol = GlobalData.getCurrencySymbol();


            function assignPrices(products) {
                var pricesMap = {};
                var currentCurrency = GlobalData.getCurrencyId();
                angular.forEach(products, function (product) {
                    if (product.prices && product.prices.length > 0) {
                        product.prices.forEach(function (price) {
                            if (price.currency === currentCurrency) {
                                pricesMap[product.product.id] = price;
                            }
                        });
                    }
                });

                $scope.prices = angular.extend($scope.prices, pricesMap);

                //initialize the viewing bar promixity script
                /* jshint ignore:start */
                initRefineAffix();
                /* jshint ignore:end */

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
            }

            function setMainImage(product) {
                if (product.media && product.media.length) {
                    var mainImageArr = product.media.filter(function (media) {
                        return media.customAttributes && media.customAttributes.main;
                    });
                    if (mainImageArr.length) {
                        product.mainImageURL = mainImageArr[0].url;
                    } else {
                        product.mainImageURL = product.media[0].url;
                    }
                }
            }

            function assignMainImage(products) {
                _.forEach(products, function (product) {
                    setMainImage(product.product);
                });
            }

            function getProducts(ids) {

                var query = {
                    expand: 'media',
                    sort: $scope.sort
                };

                //we only want to show published products on this list
                var qSpec = 'published:true';
                qSpec = qSpec + ' ' + 'id:(' + ids + ')';
                query.q = qSpec;

                ProductSvc.queryProductDetailsList(query).then(
                    function (products) {
                        $scope.requestInProgress = false;
                        if (products) {
                            $scope.products = $scope.products.concat(products);
                            if ($scope.products.length === 0) {
                                $scope.pagination.productsFrom = 0;
                            }

                            if (products.length) {
                                assignMainImage(products);
                                assignPrices(products);
                            }

                            //Set page parameter
                            $location.search('page', $scope.pageNumber).replace();

                            //Send event that search is done
                            $rootScope.$emit('search:performed', { searchTerm: $scope.searchString, numberOfResults: $scope.total });
                        }
                    }, function () {
                        $scope.requestInProgress = false;
                    });
            }


            $scope.addMore = function () {

                // prevent additional API calls if all products are retrieved
                // infinite scroller initiates lots of API calls when scrolling to the bottom of the page
                if (!GlobalData.products.meta.total || $scope.products.length < GlobalData.products.meta.total) {
                    if (!$scope.requestInProgress) {
                        $scope.pageNumber = $scope.pageNumber + 1;

                        $scope.requestInProgress = true;

                        var page = $scope.pageNumber;

                        ysearchSvc.getResults($scope.searchString, {hitsPerPage: $scope.pageSize, page: page - 1})
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
                $scope.sort = GlobalData.products.lastSort;
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

