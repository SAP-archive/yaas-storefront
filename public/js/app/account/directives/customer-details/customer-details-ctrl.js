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
        .controller('CustomerDetailsCtrl', ['$scope', 'AuthDialogManager', '$uibModal', 'AccountSvc',
            function ($scope, AuthDialogManager, $uibModal, AccountSvc) {

                $scope.modalInstance = {};

                $scope.editUserName = function (account) {
                    $scope.modalInstance = $uibModal.open({
                        templateUrl: 'js/app/account/templates/modals/edit-user-name-dialog.html',
                        controller: 'EditUserNameDialogCtrl',
                        resolve: {
                            account: function () {
                                return account;
                            }
                        },
                        backdrop: 'static'
                    });

                    $scope.modalInstance.result.then(function (result) {
                        $scope.account = result;
                    });
                };

                $scope.editUserEmail = function (account) {

                    $uibModal.open({
                        templateUrl: 'js/app/account/templates/modals/edit-user-email-dialog.html',
                        controller: 'EditUserEmailDialogCtrl',
                        resolve: {
                            account: function () {
                                return {
                                    email: account.contactEmail
                                };
                            }
                        }
                    });
                };

                $scope.updatePassword = function () {
                    AuthDialogManager.showUpdatePassword();
                };

                $scope.isItSocialAccount = AccountSvc.isItSocialAccount($scope.account);

                // handle dialog dismissal if user select back button, etc
                $scope.$on('$destroy', function () {
                    if ($scope.modalInstance && $scope.modalInstance.dismiss) {
                        $scope.modalInstance.dismiss('cancel');
                    }
                });

                $scope.deleteAccount = function () {
                    AuthDialogManager.showDeleteAccount();
                };

            }]);
})();