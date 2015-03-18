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
     *  Handles interaction for "request password reset" dialog with follow-up "check your email" dialog.
     */
    .controller('PasswordResetCtrl', ['$scope', 'AuthSvc', 'AuthDialogManager', '$state', 'title', 'instructions',
        function($scope, AuthSvc, AuthDialogManager, $state, title, instructions ) {

        $scope.title = title || 'FORGOT_PW' ;
        $scope.instructions = instructions || 'FORGOT_PW_INSTRUCT';

        $scope.closeDialog = function(){
            AuthDialogManager.close();
        };

        $scope.requestPasswordReset = function(email){
           AuthSvc.requestPasswordReset(email).then(function() {
                AuthDialogManager.close();
                AuthDialogManager.showCheckEmail();

            }, function(failure){
               if(failure.status === 404){
                   $scope.message = 'EMAIL_NOT_FOUND';
               } else {
                   $scope.message = failure.message;
               }
            });
        };

        $scope.clearErrors = function(){
            $scope.message = '';
        };


    }]);