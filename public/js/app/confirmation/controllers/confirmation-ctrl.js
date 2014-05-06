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

angular.module('ds.confirmation')
    .controller('ConfirmationCtrl', ['$scope',  'orderInfo', 'orderDetails', function ($scope, orderInfo, orderDetails) {

        var OrderInfo = function(){
            this.orderId = null;
        };

        $scope.orderInfo = new OrderInfo();
        $scope.orderInfo.orderId = orderInfo;

        $scope.orderDetailsItemCount = this.getOrderItemCount();

        $scope.$on('order.placed', function(eve, eveObj){
            $scope.orderInfo.orderId = eveObj.orderId;
        });

        $scope.getOrderItemCount = function () {
            console.log('getOrderItemCount');
            var amount = 0;
            for (var i = 0; i < orderDetails.entries.length; i++) {
                amount = amount + orderDetails.entries[i].amount;
            }

            return amount;
        };

    }]);