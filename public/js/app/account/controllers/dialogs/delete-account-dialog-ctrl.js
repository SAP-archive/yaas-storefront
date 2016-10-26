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
    /**
     *  Displays the "Delete Account" modal dialog.
     */
    .controller('DeleteAccountDialogCtrl', ['$scope', 'AccountSvc', '$modalInstance', 'AuthDialogManager',
        function($scope, AccountSvc, $modalInstance, AuthDialogManager) {

            $scope.submitDisabled = false;
            $scope.showError = false;

            $scope.deleteAccount = function () {
                $scope.submitDisabled = true;

                AccountSvc.deleteAccount().then(
                    function() {
                        $modalInstance.close();
                        AuthDialogManager.showDeleteAccountConfirmRequest();
                    },
                    function(){
                        $scope.submitDisabled = false;
                        $scope.showError = true;
                    }
                );
            };

            $scope.close = function() {
                $modalInstance.dismiss('cancel');
            };

    }]);