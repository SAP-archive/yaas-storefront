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
    .controller('AccountOrderDetailCtrl', ['$scope', 'order', '$stateParams', 'GlobalData', function($scope, order, $stateParams, GlobalData) {

        $scope.order = order;
        $scope.order.id = $stateParams.orderId;
        $scope.currencySymbol = GlobalData.getCurrencySymbol();

        var getPaymentInfo = function () {
            var payment = {};

            if (order.payments[0].status === 'SUCCESS') {
                payment.status = 'Order Paid';
            }
            else {
                payment.status = 'Order Not Yet Paid';
            }

            if (order.payments[0].method === 'STRIPE') {
                payment.method = 'Credit Card/Stripe';
            }
            else {
                payment.method = 'Other Payment Method';
            }

            payment.currency = order.payments[0].currency;

            payment.paidAmount = order.payments[0].paidAmount;

            return payment;
        };

        var getItemsOrderedCount = function () {
            var count = 0;
            angular.forEach(order.entries, function (entry) {
                count += entry.amount;
            });
            return count;
        };

        $scope.itemCount = getItemsOrderedCount();

        $scope.payment = getPaymentInfo();

    }]);
