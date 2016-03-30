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
        .controller('EditUserEmailDialogCtrl', ['$scope', 'account', 'AccountSvc', '$modalInstance',
            function ($scope, account, AccountSvc, $modalInstance) {

                $scope.account = account;
                $scope.error = '';
                $scope.step = 1;

                $scope.closeEditUserDialog = function () {
                    $modalInstance.dismiss('cancel');
                };

                $scope.updateUserInfo = function () {
                    
                    AccountSvc.updateEmail($scope.account).then(function () {
                        $scope.step = 2;
                    }, function (error) {
                        if (error.status === 401) {
                            $scope.error = 'Password is not correct. Try again';
                        }
                        else if(error.status === 409) {
                            $scope.error = 'This email is already in use. Try again';
                        }
                        else {
                            $scope.error = 'Something went wrong. Try again';
                        }
                    });
                };

                $scope.confirm = function () {
                    $modalInstance.close($scope.account);
                };

            }]);
})();