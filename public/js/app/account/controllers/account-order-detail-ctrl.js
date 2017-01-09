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

angular.module('ds.account')
    .controller('AccountOrderDetailCtrl', ['$scope', 'order', '$stateParams', 'GlobalData', '$uibModal',
        function($scope, order, $stateParams, GlobalData, $uibModal) {

        $scope.order = order;
        $scope.order.id = $stateParams.orderId;
        $scope.currencySymbol = GlobalData.getCurrencySymbol($scope.order.currency);
        $scope.dateFormat = 'dd/MM/yy';
        var date = new Date(order.created);
        $scope.orderDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
        
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

        $scope.itemCount = getItemsOrderedCount();

        $scope.payment = getPaymentInfo();

        $scope.cancelOrder = function () {
            $uibModal.open({
                templateUrl: 'js/app/account/templates/dialogs/order-cancel-dialog.html',
                controller: 'OrderCancelDialogCtrl',
                backdrop: 'static',
                resolve: {
                    order: function () {
                        return order;
                    }
                }
            }).result.then(function (response) {
                $scope.order.status = response.status;
            });
        };

        $scope.showCancelBtn = function (order) {
            if (!!order.status && (order.status === 'CREATED' || order.status === 'CONFIRMED')) {
                return true;
            } else {
                return false;
            }
        };

    }]);
