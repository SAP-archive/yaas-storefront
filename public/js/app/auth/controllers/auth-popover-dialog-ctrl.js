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
 * Controller for handling authentication related modal dialogs (signUp/signIn).
 */
    .controller('AuthPopoverDialogCtrl', ['$rootScope', '$scope', '$controller', '$q', 'AuthSvc',
       'settings', 'AuthDialogManager', 'GlobalData', 'SessionSvc', 'loginOpts',
        function ($rootScope, $scope,  $controller, $q, AuthSvc,
                  settings, AuthDialogManager, GlobalData, SessionSvc, loginOpts) {


            $scope.user = AuthSvc.user;

            $scope.errors = AuthSvc.errors;

            /** Shows dialog that allows the user to create a new account.*/
            $scope.signup = function (authModel, signUpForm) {
                AuthSvc.FormSignup(authModel, signUpForm, $scope);
            };

            /** Shows dialog that allows the user to sign in so account specific information can be accessed. */
            $scope.signin = function (authModel, signinForm) {

                AuthSvc.FormSignIn(authModel, signinForm, $scope);
            };

            /** Closes the dialog. */
            $scope.continueAsGuest = function () {

            };

            // scope variable used by google+ signing directive
            $scope.googleClientId = settings.googleClientId;

            // react to event fired by goole+ signing directive
            $scope.$on('event:google-plus-signin-success', function (event, authResult) {
                onGoogleLogIn( authResult[settings.configKeys.googleResponseToken], $scope );
            });

            /** Closes the dialog.*/
            $scope.closeDialog = function(){
            };

            /** Shows the "request password reset" dialog.*/
            $scope.showResetPassword = function () {
                AuthDialogManager.showResetPassword();
            };

            $scope.clearErrors = function(){
                AuthSvc.clearErrors($scope);
            };


        }]);