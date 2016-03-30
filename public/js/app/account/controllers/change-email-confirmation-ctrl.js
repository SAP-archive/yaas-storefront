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

'use strict';

angular.module('ds.account')
    .controller('ChangeEmailConfirmationCtrl', ['$scope', '$stateParams', 'AccountSvc',
        function ($scope, $stateParams, AccountSvc) {

            $scope.token = $stateParams.token;
            $scope.confirmed = false;

            AccountSvc.confirmEmailUpdate($scope.token)
                .then(function (result) {
                    console.log(result);
                    //Message that email is changed successfully, button to redirect to home?
                    $scope.confirmed = true;
                }, function (error) {
                    console.log(error);
                    //Message that there is error, and to try again or etc?
                    $scope.error = 'Something went wrong, please try again.';
                });
        }]);