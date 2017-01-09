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

angular.module('ds.products')
    /** Controller for the 'browse products' view.  */
    .controller('BrowseProductsCtrl', ['$scope', '$rootScope', 'ProductSvc', 'GlobalData', 'CategorySvc', 'settings', 'category', '$state', '$location', '$timeout', '$anchorScroll', 'MainMediaExtractor', 'PriceSvc', '$q',
        function ($scope, $rootScope, ProductSvc, GlobalData, CategorySvc, settings, category, $state, $location, $timeout, $anchorScroll, MainMediaExtractor, PriceSvc, $q) {

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
            $scope.sortParams = GlobalData.getProductRefinements();
            $scope.sort = { selected: GlobalData.getProductRefinements()[0].id };
            $scope.currencySymbol = GlobalData.getCurrency();

            $scope.pagination = {
                productsFrom: 1,
                productsTo: 1
            };

            $scope.category = category || {};

            if (!!category) {
                $scope.$emit('category:opened', category);
            }

            $scope.lastCatId = $scope.category.id || 'allProducts';

            $scope.loadedPages = 1;
            $scope.loadMorePages = false;

            if (category !== null) {
                $scope.mainCategoryImage = MainMediaExtractor.extract(category.media);
            }

            // ensure category path is localized
            var pathSegments = $location.path().split('/');
            if ($scope.category.slug && pathSegments[pathSegments.length - 1] !== $scope.category.slug) {
                pathSegments[pathSegments.length - 1] = $scope.category.slug;
                $location.path(pathSegments.join('/'));
            }

            $rootScope.$emit('category:selected', { category: category });

            function getProductIdsFromAssignments(assignments) {

                return assignments.map(function (assignment) {
                    if (assignment.ref.type === 'product') {
                        return assignment.ref.id;
                    } else {
                        return '';
                    }
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
                        if (products) {
                            GlobalData.products.meta.total = parseInt(products.headers[settings.headers.paging.total.toLowerCase()], 10) || 0;
                            if (concat) {
                                $scope.products = $scope.products.concat(products);
                            } else {
                                $scope.products = products;
                            }
                            if ($scope.products.length === 0) {
                                $scope.pagination.productsFrom = 0;
                            }
                            else if ($scope.products.length > 0 && query.pageNumber === 1) {
                                //Check for visible items in viewport
                            }
                            $scope.total = GlobalData.products.meta.total;

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

                        //initialize the viewing bar promixity script
                        $scope.requestInProgress = false;
                    }, function () {
                        $scope.requestInProgress = false;
                    });
            }

            // Primary Reason for categories to be updated is that the language change.
            //  We'll have to retrieve the current slug for the category (and thus this page)
            //  and reload to ensure the breadcrumbs and slug reflect the latest setting.
            var unbindCat = $rootScope.$on('categories:updated', function (eve, obj) {
                if (obj.source === settings.eventSource.languageUpdate) {
                    CategorySvc.getCategoryById($scope.category.id).then(function (cat) {
                        var parms = {};
                        if (cat && cat.slug) {
                            parms.catName = cat.slug;
                        }
                        $state.transitionTo('base.category', parms, {
                            reload: true,
                            inherit: true,
                            notify: true
                        });

                    });
                }

            });

            $scope.$on('$destroy', unbindCat);

            /*
             Retrieves more products from the product service and adds them to the product list.
             This function is only for infinite scrolling, which is the default state.  It is disabled once a sort is applied.
             */
            $scope.addMore = function () {
                // category selected, but no products associated with category - leave blank for time being
                if ($scope.category.assignments && $scope.category.assignments.length === 0) {
                    $scope.products = [];
                    $scope.pagination = {
                        productsFrom: 0,
                        productsTo: 0
                    };
                    $scope.total = 0;
                    return;
                }
                /*
                 this function is only for infinite scrolling, which is disabled when a sort is applied.
                 */

                // prevent additional API calls if all products are retrieved
                // infinite scroller initiates lots of API calls when scrolling to the bottom of the page
                if (!GlobalData.products.meta.total || $scope.products.length < GlobalData.products.meta.total) {
                    if (!$scope.requestInProgress) {
                        $scope.pageNumber = $scope.pageNumber + 1;

                        var qSpec = 'published:true';
                        if ($scope.category.assignments && $scope.category.assignments.length > 0) {
                            qSpec = qSpec + ' ' + 'id:(' + getProductIdsFromAssignments($scope.category.assignments) + ')';
                        } // If no category assignment (rather than length = 0), we're showing "all" products
                        var query = {
                            pageNumber: $scope.pageNumber,
                            pageSize: $scope.pageSize,
                            q: qSpec,
                            sort: $scope.sort.selected
                        };
                        queryProducts(query, true);
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
                $scope.sort = GlobalData.products.lastSort || { selected: GlobalData.getProductRefinements()[0].id };
                $scope.loadMorePages = true;
            }

            // trigger initial load of items
            $scope.addMore();

            //Save id of the last viewed element, last viewed page and current sort
            $scope.openProductDetails = function (productId) {
                GlobalData.products.lastViewedProductId = productId;
                GlobalData.products.lastSort = $scope.sort;
            };

            $scope.setSortedPage = function () {

                $scope.setSortedPageSize = void 0;
                $scope.setSortedPageNumber = 1;
                if (($scope.pageSize > $scope.total) && ($scope.total !== 0)) {
                    $scope.setSortedPageSize = $scope.total;
                }

                //check to see if the current page number times the page size is going to be greater than the total product count
                //if it is then we need to set caps on the pageSize and page number
                $scope.setSortedPageSize = ($scope.pageNumber * $scope.pageSize > $scope.total) ? $scope.total : $scope.pageNumber * $scope.pageSize;

                /*
                 it is important to note that the $scope.pageNumber and $scope.pageSize are not being modified as they  need
                 to be unmidified for the addMore() method to work for the inifinte scroll functionality
                 */
                //we only want to show published products on this list
                var qSpec = 'published:true';
                if ($scope.category.assignments && $scope.category.assignments.length > 0) {
                    qSpec = qSpec + ' ' + 'id:(' + getProductIdsFromAssignments($scope.category.assignments) + ')';
                }

                var query = {
                    pageNumber: $scope.setSortedPageNumber,
                    pageSize: $scope.setSortedPageSize,
                    sort: $scope.sort.selected,
                    q: qSpec
                };
                queryProducts(query, false);
            };

            $scope.showRefineContainer = function () {
                $scope.refineContainerShowing = !$scope.refineContainerShowing;
            };

        }]);
