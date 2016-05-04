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
 * Controller for handling authentication related modal dialogs (signUp/signIn).
 */
    .controller('AuthModalDialogCtrl', ['$rootScope', '$scope', 'AuthSvc',
        'settings', 'AuthDialogManager', 'loginOpts', 'showAsGuest', '$state', 'YGoogleSignin', '$window',
        function ($rootScope, $scope, AuthSvc, settings, AuthDialogManager, loginOpts, showAsGuest, $state, YGoogleSignin, $window) {

            $scope.user = {
                signup: {},
                signin: {
                    email: '',
                    password: ''
                }
            };

            $scope.errors = {
                signup: [],
                signin: []
            };

            $scope.fbAppId = settings.facebookAppId;
            $scope.googleClientId = settings.googleClientId;
            // determines "continue as guest" button:
            $scope.showAsGuest = showAsGuest;
            $scope.cookiesEnabled = $window.navigator.cookieEnabled;

            AuthSvc.initFBAPI();
            AuthSvc.initGoogleAPI();

            $scope.$on('authlogin:error', function(){
                var response = { status: 0 };
                $scope.errors.signin = AuthSvc.extractServerSideErrors(response);
            });

            /** Closes the dialog.*/
            $scope.closeDialog = function(){
                AuthDialogManager.close();
            };

            /** Shows dialog that allows the user to create a new account.*/
            $scope.signup = function (authModel, signUpForm) {
                if (signUpForm.$valid) {
                    AuthSvc.signup(authModel, loginOpts).then(
                        function (response) {
                            if (response.cookiesDisabled) {
                                $scope.showCreateAccountErrMsg = true;
                                $scope.user.signup.email = '';
                                $scope.user.signup.password = '';
                            } else {
                                $scope.closeDialog();
                            }
                        }, function (response) {
                            $scope.errors.signup = AuthSvc.extractServerSideErrors(response);
                        }
                    );
                }
            };

            /** Shows dialog that allows the user to sign in so account specific information can be accessed. */
            $scope.signin = function (authModel, signinForm) {
                if (signinForm.$valid) {
                    AuthSvc.signin(authModel).then(function () {
                        $scope.closeDialog();
                    }, function (response) {
                        $scope.errors.signin = AuthSvc.extractServerSideErrors(response);
                    });
                }
            };

            /** Closes the dialog. */
            $scope.continueAsGuest = function () {
                $scope.closeDialog();
                $state.go('base.checkout.details');
            };

            /** Shows the "request password reset" dialog.*/
            $scope.showResetPassword = function () {
                AuthDialogManager.showResetPassword();
            };

            $scope.clearErrors = function() {
                $scope.errors.signin = [];
                $scope.errors.signup = [];
            };

            $scope.fbLogin = function () {
                AuthSvc.faceBookLogin();
            };

            $scope.googleLogin = function () {
                YGoogleSignin.login().then(function (user) {
                    AuthSvc.onGoogleLogIn(user);
                });
            };

            var unbind = $rootScope.$on('user:socialLogIn', function(eve, obj){
                if(obj.loggedIn){
                    $scope.closeDialog();
                } else {
                    $scope.errors.signin = [({message: 'LOGIN_FAILED'})];
                }
            });

            $scope.$on('$destroy', unbind);

        }]);