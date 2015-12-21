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
        .controller('CustomerDetailsCtrl', ['$scope', 'AccountSvc', 'AuthDialogManager', '$modal', 'GlobalData',
            function ($scope, AccountSvc, AuthDialogManager, $modal, GlobalData) {

                var originalAccountData;
                $scope.modalInstance = {};
                $scope.titles = GlobalData.getUserTitles();

                $scope.editAccountInfo = function (mtype) {
                    $scope.mtype = mtype;
                    originalAccountData = angular.copy($scope.account);

                    $scope.modalInstance = $modal.open({
                        templateUrl: 'js/app/account/templates/editUser-dialog.html',
                        scope: $scope
                    });
                };

                $scope.closeEditUserDialog = function () {
                    $scope.account = originalAccountData;
                    $scope.modalInstance.close();
                };

                $scope.updateUserInfo = function () {
                    var account = angular.copy($scope.account);

                    var emailRegexp = GlobalData.getEmailRegEx();

                    if ($scope.mtype === 'email' && !emailRegexp.test(account.contactEmail)) {
                        //return $translate('PLEASE_ENTER_VALID_EMAIL');
                    }

                    AccountSvc.updateAccount(account).then(function () {
                        $scope.modalInstance.close();
                    });
                };

                $scope.updatePassword = function () {
                    AuthDialogManager.showUpdatePassword();
                };

                // handle dialog dismissal if user select back button, etc
                $scope.$on('$destroy', function () {
                    if ($scope.modalInstance) {
                        $scope.modalInstance.dismiss('cancel');
                    }
                });

            }]);
})();