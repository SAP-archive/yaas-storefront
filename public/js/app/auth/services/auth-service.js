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

/**
 *  Encapsulates access to the "authentication" service.
 */
angular.module('ds.auth')
    .factory('AuthSvc', ['AuthREST', 'settings', 'TokenSvc', 'GlobalData', 'storeConfig', '$state', '$q', 'SessionSvc',
        function (AuthREST, settings, TokenSvc, GlobalData, storeConfig, $state, $q, SessionSvc) {

        function loginAndSetToken(user){
            return AuthREST.Customers.all('login').customPOST(user).then(function(response){
                TokenSvc.setToken(response.accessToken, user ? user.email : null);
            });
        }

        var AuthenticationService = {

            user:{
                signup: {},
                signin: {
                    email: '',
                    password: ''
                }
            },

            errors:{
                signup: [],
                signin: []
            },


            extractServerSideErrors: function (response)
            {
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
            },

            FormSignup: function(authModel, signUpForm, scope, modalInstance, type){

                var deferred = $q.defer();

                if (signUpForm.$valid) {
                    AuthenticationService.signup(authModel, {fromSignUp: true}).then(
                        function (response) {
                            scope.errors.signup = [];
                            settings.hybrisUser = scope.user.signup.email;
                            if(type != undefined){
                                modalInstance.close(response);
                            }
                            deferred.resolve(response);
                        }, function (response) {
                            scope.errors.signup = AuthenticationService.extractServerSideErrors(response);
                            deferred.reject({ message: 'Signup form is invalid!', errors: scope.errors.signup });
                        }
                    );
                } else {
                    deferred.reject({ message: 'Signup form is invalid!'});
                }
                return deferred.promise;
            },

            FormSignIn: function(authModel, signinForm, scope, modalInstance, type)
            {
                var deferred = $q.defer();
                if (signinForm.$valid) {
                    AuthenticationService.signin(authModel).then(function () {
                        scope.errors.signin = [];
                        settings.hybrisUser = scope.user.signin.email;
                        if(type != undefined){
                            modalInstance.close({});
                        }
                        deferred.resolve({});
                    }, function (response) {
                        scope.errors.signin = AuthenticationService.extractServerSideErrors(response);
                        deferred.reject(response);
                    });
                } else {
                    deferred.reject({ message: 'Signin form is invalid!'});
                }
                return deferred.promise;

            },

            clearErrors: function(scope)
            {
                scope.errors.signin = [];
                scope.errors.signup = [];
            },


            /**
             * Performs login (customer specific or anonymous) and updates the current OAuth token in the local storage.
             * Returns a promise with "success" = access token for when that action has been performed.
             *
             * @param user JSON object (with email, password properties), or null for anonymous user.
             */
            signin: function (user) {
                return loginAndSetToken(user).then(function(){
                    SessionSvc.afterLogIn();
                });
            },

            signup: function (user, context) {
                return AuthREST.Customers.all('signup').customPOST(user).then(function(){
                    loginAndSetToken(user).then(function(){
                        SessionSvc.afterLoginFromSignUp(context);
                    }, function(){
                        $q.reject('SignIn failed');
                    });
                });
            },

            /** Logs the customer out and removes the token cookie. */
            signOut: function () {
                AuthREST.Customers.all('logout').customGET('', { accessToken: TokenSvc.getToken().getAccessToken() });
                // unset token after logout - new anonymous token will be generated for next request automatically
                TokenSvc.unsetToken(settings.accessCookie);
                SessionSvc.afterLogOut();
            },

            /** Returns true if there is a user specific OAuth token cookie for the current tenant.*/
            isAuthenticated: function () {
                var token = TokenSvc.getToken();
                return !!token.getAccessToken() && !!token.getUsername() && token.getTenant() === storeConfig.storeTenant;
            },

            /** Issues a 'reset password' request. Returns the promise of the completed action.*/
            requestPasswordReset: function(email) {
                var user = {
                    email: email
                };
                return AuthREST.Customers.all('password').all('reset').customPOST( user);
            },

            /** Issues a 'change password' request.  Returns the promise of the completed action.
             * @param token that was obtained for password reset
             * @param new password
             */
            changePassword: function(token, newPassword) {
                var user = {
                    token: token,
                    password: newPassword
                };
                return AuthREST.Customers.all('password').all('reset').all('update').customPOST( user);
            },

            updatePassword: function(oldPassword, newPassword, email) {
                var payload = {
                    currentPassword: oldPassword,
                    newPassword: newPassword,
                    email: email
                };
                return AuthREST.Customers.all('password').all('change').customPOST(payload);
            }
        };
        return AuthenticationService;

    }]);