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

        var setupOrderDetails = function () {
            if (orderDetails.shippingAddress.name) {
                $scope.shippingAddressLine1 = orderDetails.shippingAddress.name;
            }
            else if (orderDetails.shippingAddress.companyName) {
                $scope.shippingAddressLine1 = orderDetails.shippingAddress.companyName;
            }

            if (orderDetails.shippingAddress.streetNumber) {
                $scope.shippingAddressLine2 = orderDetails.shippingAddress.streetNumber;

                if (orderDetails.shippingAddress.street) {
                    $scope.shippingAddressLine2 = $scope.shippingAddressLine2 +
                        ' ' + orderDetails.shippingAddress.street;

                    if (orderDetails.shippingAddress.streetAppendix) {
                        $scope.shippingAddressLine2 = $scope.shippingAddressLine2 +
                            ' ' + orderDetails.shippingAddress.streetAppendix;
                    }
                }
            }

            $scope.shippingAddressLine3 = orderDetails.shippingAddress.city + ', ' + orderDetails.shippingAddress.state +
                ' ' + orderDetails.shippingAddress.zipCode;

        };

        setupOrderDetails();


    }]);