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
 *  Displays "Account Deleted" modal upon successful deletion of customer profile from storefront
 *  Assumes that the stateParams provide the token that is required to make the service call.
 */
    .controller('DeleteAccountCtrl', ['$scope', '$stateParams', 'AccountSvc', 'AuthSvc', 'GlobalData', '$state', 'AuthDialogManager',
        function ($scope, $stateParams, AccountSvc, AuthSvc, GlobalData, $state, AuthDialogManager) {
            $scope.token = $stateParams.token || '';
            $state.go('base.category').then(function() {
                AccountSvc.deleteAccount($scope.token).then(
                    function () {
                        if (GlobalData.user.isAuthenticated) {
                            AuthSvc.signOut();
                        }
                        AuthDialogManager.showDeleteAccountConfirmation(true);
                    },
                    function () {
                        AuthDialogManager.showDeleteAccountConfirmation(false);
                    }
                );
            });
        }]);