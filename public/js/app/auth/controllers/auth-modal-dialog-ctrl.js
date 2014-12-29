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
    .controller('AuthModalDialogCtrl', ['$rootScope', '$scope', '$modalInstance', '$controller', '$q', 'AuthSvc', 'SessionSvc',
        'settings', 'AuthDialogManager',
        function ($rootScope, $scope, $modalInstance, $controller, $q, AuthSvc, SessionSvc, settings, AuthDialogManager) {

            $scope.user = AuthSvc.user;
            $scope.errors = AuthSvc.errors;
            $scope.socialLogin = {
                fbAppId: settings.facebookAppId,
                googleClientId: settings.googleClientId
            };
            
            AuthSvc.initFBAPI($scope, $modalInstance);

            // react to event fired by goole+ signing directive
            $scope.$on('event:google-plus-signin-success', function (event, authResult) {
                AuthSvc.onGoogleLogIn( authResult[settings.configKeys.googleResponseToken], $scope, $modalInstance);
            });

            /** Shows dialog that allows the user to create a new account.*/
            $scope.signup = function (authModel, signUpForm) {
                AuthSvc.formSignUp(authModel, signUpForm, $scope, $modalInstance, 'modal');
            };

            /** Shows dialog that allows the user to sign in so account specific information can be accessed. */
            $scope.signin = function (authModel, signinForm) {
                AuthSvc.formSignIn(authModel, signinForm, $scope, $modalInstance, 'modal');
            };

            /** Closes the dialog. */
            $scope.continueAsGuest = function () {
                $modalInstance.close();
            };

            /** Closes the dialog.*/
            $scope.closeDialog = function(){
                $modalInstance.close();
            };

            /** Shows the "request password reset" dialog.*/
            $scope.showResetPassword = function () {
                AuthDialogManager.showResetPassword();
            };

            $scope.clearErrors = function() {
                AuthSvc.clearErrors($scope);
            };
            /** Prompts the Facebook SKD to re-parse the <fb:login-button> tag in the
             * sign-up HTML and display the button.  Otherwise, the button is only shown at FB SDK load time
             * and not for subsequent displays.
             */
            $scope.fbParse = AuthSvc.fbParse;

            $scope.fbLogin = function () {
                AuthSvc.faceBookLogin($scope);
            };

        }]);