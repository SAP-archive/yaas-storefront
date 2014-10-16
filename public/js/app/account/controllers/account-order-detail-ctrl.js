/*
 * [y] hybris Platform
 *
 * Copyright (c) 2000-2014 hybris AG
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of hybris
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with hybris.
 */

'use strict';

angular.module('ds.account')
    .controller('AccountOrderDetailCtrl', ['$scope', 'order', 'ProductSvc', 'PriceSvc', '$stateParams', 'GlobalData', function($scope, order, ProductSvc, PriceSvc, $stateParams, GlobalData) {

        $scope.order = order;
        $scope.order.id = $stateParams.orderId;
        $scope.orderProducts = [];
        $scope.prices = {};
        $scope.currencySymbol = GlobalData.getCurrencySymbol();

        /*
         Retrieves pricing information for the list of products.
         */
        var getPrices = function() {
            var productIds = '';
            angular.forEach($scope.order.entries, function (entry, key) {
                if (key === $scope.order.entries.length - 1) {
                    productIds = productIds + (entry.product.id);
                }
                else {
                    productIds = productIds + (entry.product.id + ',');
                }
            });
            var queryPrices = {
                q: 'productId:(' + productIds + ')' + ' currency:' + GlobalData.storeCurrency
            };

            PriceSvc.query(queryPrices).then(
                function (pricesResponse) {
                    if (pricesResponse) {
                        var pricesMap = {};

                        pricesResponse.forEach(function (price) {
                            pricesMap[price.productId] = price;
                        });

                        $scope.prices = angular.extend($scope.prices, pricesMap);
                    }
                });
        };

        var getPaymentInfo = function () {
            return $scope.order.payments[0];
        };

        var getItemsOrderedCount = function () {
            var count = 0;
            angular.forEach(order.entries, function (entry) {
                count += entry.amount;
            });
            return count;
        };

        /*
         this function is necessary because the order entries array does not contain
         all the product information we need
         */
        var getProductsInOrder = function () {
            var query = {};
            var ids = '';

            angular.forEach(order.entries, function (entry, key) {
                ids += entry.product.id;
                if (key !== ($scope.order.entries.length - 1)) {
                    ids += ',';
                }
            });

            query.q = 'id:(' + ids + ')';

            return query;

        };

        $scope.itemCount = getItemsOrderedCount();

        $scope.payment = getPaymentInfo();

        var query = getProductsInOrder();

        getPrices();

        ProductSvc.query(query).then(function (products) {
            if (products) {
                $scope.orderProducts = products;
                angular.forEach(order.entries, function (entry, key) {
                    if ($scope.orderProducts.length > key) {
                        $scope.orderProducts[key].quantity = entry.amount;
                    }
                });
            }
        });

    }]);
