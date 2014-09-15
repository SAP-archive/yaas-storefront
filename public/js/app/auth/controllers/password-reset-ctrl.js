/**
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

angular.module('ds.auth')
    /**
     * Authorization Dialog Controller. 
     * Proxies calls to AuthCtrl and handles the lifecycle of authorization modal (destroying it when needed ...).
     */
    .controller('PasswordResetCtrl', ['$scope', '$modalInstance', 'AuthSvc', 'AuthDialogManager',
        function($scope, $modalInstance, AuthSvc, AuthDialogManager) {


        $scope.requestPasswordReset = function(email){
            AuthSvc.requestPasswordReset(email).then(function() {
                $modalInstance.close();
                AuthDialogManager.showCheckEmail();
            }, function(failure){
                $modalInstance.close();
                window.alert('Password reset failed: '+failure);
            });
        };

        $scope.showChangePassword = function(){
            $modalInstance.close();
            AuthDialogManager.showChangePassword();
        };

        $scope.changePassword = function(token, password) {
            AuthSvc.changePassword(token, password).then(function(){
                $modalInstance.close();
                AuthDialogManager.showPasswordChanged();
            }, function(error){
                $modalInstance.close();
                window.alert('Password update failed: '+error);
            });
        };

    }]);