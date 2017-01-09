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

(function () {
    'use strict';

    angular.module('ds.account')
        .controller('EditUserEmailDialogCtrl', ['$scope', 'account', 'AccountSvc', '$uibModalInstance', '$translate',
            function ($scope, account, AccountSvc, $uibModalInstance, $translate) {

                $scope.account = account;
                $scope.error = '';
                $scope.step = 1;

                $scope.closeEditUserDialog = function () {
                    $uibModalInstance.dismiss('cancel');
                };

                $scope.updateUserInfo = function () {
                    
                    //Force sync of email address
                    $scope.account.syncContactEmail = true;

                    AccountSvc.updateEmail($scope.account).then(function () {
                        $scope.step = 2;
                    }, function (error) {
                        if (error.status === 401) {
                            $scope.error = $translate.instant('EDIT_EMAIL_PASSWORD_NOT_CORRECT');
                        }
                        else if(error.status === 409) {
                            $scope.error = $translate.instant('EDIT_EMAIL_ALREADY_IN_USE');
                        }
                        else {
                            $scope.error = $translate.instant('EDIT_EMAIL_SOMETHING_WENT_WRONG');
                        }
                    });
                };

                $scope.confirm = function () {
                    $uibModalInstance.close($scope.account);
                };

            }]);
})();