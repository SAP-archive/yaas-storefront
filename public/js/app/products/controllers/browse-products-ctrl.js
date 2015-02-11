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
    .controller('BrowseProductsCtrl', ['$scope', '$rootScope', 'ProductSvc', 'PriceSvc', 'GlobalData', 'CategorySvc', 'settings', 'category', '$state', '$location',
        function ($scope, $rootScope, ProductSvc, PriceSvc, GlobalData, CategorySvc, settings, category, $state, $location) {

            $scope.pageSize = 8;
            $scope.pageNumber = 0;
            $scope.setSortedPageSize = void 0;
            $scope.setSortedPageNumber = 1;
            $scope.sort = '';
            $scope.products = [];
            $scope.total = GlobalData.products.meta.total;
            $scope.productsFrom = 1;
            $scope.productsTo = $scope.pageSize;
            $scope.store = GlobalData.store;
            $scope.prices = {};
            $scope.requestInProgress = false;
            $scope.PLACEHOLDER_IMAGE = settings.placeholderImage;

            $scope.category = category || {};

            // ensure category path is localized
            var pathSegments = $location.path().split('/');
            if ($scope.category.slug && pathSegments[pathSegments.length - 1] !== $scope.category.slug) {
                pathSegments[pathSegments.length - 1] = $scope.category.slug;
                $location.path(pathSegments.join('/'));
            }

            $rootScope.$emit('category:selected', {category: category});

            function getProductIdsFromElements(elements) {

                return elements.map(function (element) {
                    if (element.ref.type === 'product') {
                        return element.ref.id;
                    } else {
                        return '';
                    }
                });
            }

            $scope.currencySymbol = GlobalData.getCurrencySymbol();


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

                PriceSvc.query(queryPrices).then(
                    function (pricesResponse) {
                        if (pricesResponse) {
                            var pricesMap = {};

                            pricesResponse.forEach(function (price) {
                                if (price.currency === GlobalData.getCurrencyId()) {
                                    pricesMap[price.productId] = price;
                                }
                            });

                            $scope.prices = angular.extend($scope.prices, pricesMap);

                            //initialize the viewing bar promixity script
                            /* jshint ignore:start */
                            initRefineAffix();
                            /* jshint ignore:end */

                        }
                    }
                );
            }

            function setMainImage(product){
                if(product.media && product.media.length ){
                    var mainImageArr = product.media.filter(function(media){
                        return media.customAttributes && media.customAttributes.main;
                    });
                    if(mainImageArr.length ){
                        product.mainImageURL = mainImageArr[0].url;
                    } else  {
                        product.mainImageURL = product.media[0].url;
                    }
                }
            }

            function assignMainImage(products){
                _.forEach(products, function(product){
                   setMainImage(product);
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
                if ($scope.category.elements && $scope.category.elements.length === 0) {
                    $scope.products = [];
                    $scope.productsFrom = 0;
                    $scope.productsTo = 0;
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
                        if ($scope.category.elements && $scope.category.elements.length > 0) {
                            qSpec = qSpec + ' ' + 'id:(' + getProductIdsFromElements($scope.category.elements) + ')';
                        } // If no category elements (rather than length = 0), we're showing "all" products
                        var query = {
                            pageNumber: $scope.pageNumber,
                            pageSize: $scope.pageSize,
                            expand: 'media',
                            // we only want to show published products on this list
                            q: qSpec
                        };

                        if ($scope.sort) {
                            query.sort = $scope.sort;
                        }

                        $scope.requestInProgress = true;
                        ProductSvc.query(query).then(
                            function (products) {
                                $scope.requestInProgress = false;
                                if (products) {
                                    GlobalData.products.meta.total = parseInt(products.headers[settings.headers.paging.total.toLowerCase()], 10) || 0;
                                    $scope.products = $scope.products.concat(products);
                                    $scope.productsTo = $scope.products.length;
                                    $scope.total = GlobalData.products.meta.total;
                                    getPrices(products);
                                    assignMainImage(products);
                                }
                            }, function () {
                                $scope.requestInProgress = false;
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

                if ($scope.productsTo > $scope.total && $scope.total !== 0) {
                    $scope.productsTo = $scope.total;
                }
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

                $scope.getViewingNumbers($scope.setSortedPageNumber);

                /*
                 it is important to note that the $scope.pageNumber and $scope.pageSize are not being modified as they  need
                 to be unmidified for the addMore() method to work for the inifinte scroll functionality
                 */
                var query = {
                    pageNumber: $scope.setSortedPageNumber,
                    pageSize: $scope.setSortedPageSize,
                    expand: 'media',
                    sort: $scope.sort
                };

                //we only want to show published products on this list
                var qSpec = 'published:true';
                if ($scope.category.elements && $scope.category.elements.length > 0) {
                    qSpec = qSpec + ' ' + 'id:(' + getProductIdsFromElements($scope.category.elements) + ')';
                }
                query.q = qSpec;

                ProductSvc.query(query).then(function (products) {
                    if (products) {
                        GlobalData.products.meta.total = parseInt(products.headers[settings.headers.paging.total.toLowerCase()], 10) || 0;
                        $scope.products = products;
                        $scope.productsTo = $scope.products.length;
                        $scope.total = GlobalData.products.meta.total;
                        getPrices(products);
                        assignMainImage(products);
                    }
                    else {
                        $scope.requestInProgress = false;
                    }

                });


            };

            $scope.showRefineContainer = function () {
                $scope.refineContainerShowing = !$scope.refineContainerShowing;
            };

        }]);
