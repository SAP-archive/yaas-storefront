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
    .controller('ChangeEmailConfirmationCtrl', ['$scope', '$stateParams', 'AccountSvc', 'AuthSvc', '$translate',
        function ($scope, $stateParams, AccountSvc, AuthSvc, $translate) {

            $scope.token = $stateParams.token;
            $scope.confirmed = false;

            AccountSvc.confirmEmailUpdate($scope.token)
                .then(function () {
                    
                    //Sign out user
                    AuthSvc.signOut();

                    //Message that email is changed successfully
                    $scope.confirmed = true;
                }, function (error) {
                    console.log(error);
                    //Message that there is error, and to try again or etc?
                    $scope.error = $translate.instant('EDIT_EMAIL_SOMETHING_WENT_WRONG');
                });
        }]);