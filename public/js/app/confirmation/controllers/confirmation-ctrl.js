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
    .controller('ConfirmationCtrl', ['$scope',  '$stateParams', 'OrderDetailSvc', function ($scope, $stateParams, OrderDetailSvc) {
        /* OrderDetails NOT injected because we don't want to delay the display of the page.*/

        $scope.orderInfo = {};
        $scope.orderInfo.orderId = $stateParams.orderId;

        OrderDetailSvc.getFormattedConfirmationDetails($scope.orderInfo.orderId).then(function(details){
            $scope.confirmationDetails =  details;
        });

    }]);