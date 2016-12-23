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
'use strict';

angular.module('ds.auth')
    /**
     *  Displays the "change password" modal dialog.  This is initiated directly by the user
     *  (not via the 'reset password' function) and does not require a token.
     */
    .controller('PasswordUpdateCtrl', ['$scope', 'AuthDialogManager', 'AuthSvc', '$state', '$stateParams', 'TokenSvc', '$uibModalInstance',
        function($scope, AuthDialogManager, AuthSvc, $state, $stateParams, TokenSvc, $uibModalInstance) {

            $scope.showPristineErrors = false;
            $scope.submitDisabled = false;
            $scope.errors = [];

            $scope.showAllErrors = function(){
                $scope.showPristineErrors = true;
                return true;
            };

            $scope.updatePassword = function (oldPassword, newPassword) {
                $scope.submitDisabled = true;
                $scope.errors = [];

                AuthSvc.updatePassword(oldPassword, newPassword, TokenSvc.getToken().getUsername() || '').then(
                    function() {
                        $uibModalInstance.close();
                    },
                    function(error){
                        $scope.submitDisabled = false;

                        if (error.status === 401) {
                            $scope.errors.push({ message: 'WRONG_CURRENT_PASSWORD' });
                        } else if(error.data && error.data.message) {
                            $scope.errors.push({ message: error.data.message });
                        }
                    }
                );
            };

            $scope.close = function() {
                $uibModalInstance.dismiss('cancel');
            };

            $scope.clearErrors = function(){
                $scope.errors = [];
            };

    }]);