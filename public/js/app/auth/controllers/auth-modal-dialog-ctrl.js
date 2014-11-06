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
    .controller('AuthModalDialogCtrl', ['$rootScope', '$scope', '$modalInstance', '$controller', '$q', 'AuthSvc',
       'settings', 'AuthDialogManager', 'GlobalData', 'loginOpts', '$window',
        function ($rootScope, $scope, $modalInstance, $controller, $q, AuthSvc,
                  settings, AuthDialogManager, GlobalData, loginOpts, $window) {

            try {
                $window.fbAsyncInit = function () {
                    FB.init({
                        appId: settings.facebookAppId,
                        xfbml: false,
                        version: 'v2.1'
                    });

                    FB.Event.subscribe('auth.statusChange', function (response) {

                        if (response.status === 'connected') { // The person is logged into Facebook, and has logged into the store/"app"
                            $modalInstance.close();
                            AuthSvc.socialLogin('facebook', response.authResponse.accessToken).then(function () {
                            }, function (error) {
                                window.alert(error);
                            });

                        } else if (response.status === 'not_authorized' || response.status === 'unknown') { // 'not_authorized' The person is logged into Facebook, but not into the app
                            if (AuthSvc.isAuthenticated()) {    //  'unknown'  The person is not logged into Facebook, so you don't know if they've logged into your app.
                                AuthSvc.signOut();
                            }
                        }
                    });
                    FB.XFBML.parse();
                };
                (function (d, s, id) {
                    var js, fjs = d.getElementsByTagName(s)[0];
                    var fbElement = d.getElementById(id);
                    if (fbElement) {

                        return;
                    }
                    js = d.createElement(s);
                    js.id = id;
                    js.src = '//connect.facebook.net/en_US/sdk.js';
                    fjs.parentNode.insertBefore(js, fjs);
                }(document, 'script', 'facebook-jssdk'));

            } catch (e){
                console.error('Unable to initialize Facebook API');
            }

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


            var extractServerSideErrors = function (response) {
                console.log(response);
                var errors = [];
                if (response.status === 400 && response.data.details && response.data.details[0].field && response.data.details[0].field === 'password') {
                    errors.push({message: 'PASSWORD_INVALID'});
                } else if (response.status === 401 || response.status === 404) {
                    errors.push({ message: 'INVALID_CREDENTIALS' });
                } else if (response.status === 409) {
                    errors.push({ message: 'ACCOUNT_ALREADY_EXISTS' });
                } else if (response.status === 403) {
                    errors.push({ message: 'ACCOUNT_LOCKED' });
                } else if (response.data && response.data.details && response.data.details.message) {
                    errors.push(response.data.details.message);
                } else if (response.data && response.data.message) {
                    errors.push({ message: response.data.message });
                } else {
                    errors.push({message: response.status});
                }

                return errors;
            };

            /** Shows dialog that allows the user to create a new account.*/
            $scope.signup = function (authModel, signUpForm) {
                var deferred = $q.defer();
                if (signUpForm.$valid) {
                    AuthSvc.signup(authModel, loginOpts).then(
                        function (response) {
                            $scope.errors.signup = [];
                            settings.hybrisUser = $scope.user.signup.email;
                            $modalInstance.close(response);
                            deferred.resolve(response);
                        }, function (response) {
                            $scope.errors.signup = extractServerSideErrors(response);
                            deferred.reject({ message: 'Signup form is invalid!', errors: $scope.errors.signup });
                        }
                    );
                } else {
                    deferred.reject({ message: 'Signup form is invalid!'});
                }
                return deferred.promise;
            };

            /** Shows dialog that allows the user to sign in so account specific information can be accessed. */
            $scope.signin = function (authModel, signinForm) {
                var deferred = $q.defer();
                if (signinForm.$valid) {
                    AuthSvc.signin(authModel).then(function () {
                        $scope.errors.signin = [];
                        settings.hybrisUser = $scope.user.signin.email;
                        $modalInstance.close({});
                        deferred.resolve({});
                    }, function (response) {
                        $scope.errors.signin = extractServerSideErrors(response);
                        deferred.reject(response);
                    });
                } else {
                    deferred.reject({ message: 'Signin form is invalid!'});
                }
                return deferred.promise;
            };

            /** Closes the dialog. */
            $scope.continueAsGuest = function () {
                $modalInstance.close();
            };

            /** Shows the "request password reset" dialog.*/
            $scope.showResetPassword = function () {
                AuthDialogManager.showResetPassword();
            };

            $scope.clearErrors = function(){
                $scope.errors.signin = [];
                $scope.errors.signup = [];
            };

            $scope.fbParse = function(){
                if(FB){
                    FB.XFBML.parse();
                }
            };




        }]);