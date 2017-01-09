/**
 * [y] hybris Platform
 *
 * Copyright (c) 2000-2016 hybris AG
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of hybris
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with hybris.
 */
(function () {
    'use strict';

    angular.module('ds.account')
        .controller('OrderCancelDialogCtrl', ['$scope', '$uibModalInstance', 'order', 'OrderDetailSvc', '$translate',
            function ($scope, $uibModalInstance, order, OrderDetailSvc, $translate) {

                $scope.orderCancelError = '';

                $scope.cancelOrder = function () {
                    OrderDetailSvc.cancelOrder(order.id).then(function (response) {
                        $uibModalInstance.close({status: response.status});
                    }, function () {
                        $scope.orderCancelError = $translate.instant('ORDER_CANCEL_ERROR');
                    });
                };

                $scope.closeCancelOrderDialog = function () {
                    $uibModalInstance.dismiss('cancel');
                };

            }]);
})();