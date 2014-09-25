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
     *  Handles interaction for "request password reset" dialog with follow-up "check your email" dialog.
     */
    .controller('PasswordResetCtrl', ['$scope', '$modalInstance', 'AuthSvc', 'AuthDialogManager', '$state',
        function($scope, $modalInstance, AuthSvc, AuthDialogManager, $state) {


        $scope.requestPasswordReset = function(email){
            AuthSvc.requestPasswordReset(email).then(function() {
                $modalInstance.close();
                AuthDialogManager.showCheckEmail();

            }, function(failure){
                $modalInstance.close();
                var errorDetail = 'Unknown Error';
                if(failure && failure.data && failure.data.message) {
                    errorDetail = failure.data.message;
                }
                $scope.message = 'Password reset failed: '+ errorDetail;
            });
        };

        /** Navigates to the "changePassword" state. */
        $scope.showChangePassword = function(){
            $modalInstance.close();
            $state.transitionTo('base.changePassword');
        };
    }]);