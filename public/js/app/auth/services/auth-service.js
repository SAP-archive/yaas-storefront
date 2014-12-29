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

/**
 *  Encapsulates access to the "authentication" service.
 */
angular.module('ds.auth')
    .factory('AuthSvc', ['AuthREST', 'settings', 'TokenSvc', 'GlobalData', 'storeConfig', '$state', '$q', 'SessionSvc', '$window',
        function (AuthREST, settings, TokenSvc, GlobalData, storeConfig, $state, $q, SessionSvc, $window) {

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

            /** Calls the Facebook API to validate that the user is logged into FB - if yes,
             * the existing FB token will be used to log the user into the store.  Note that this
             * function should only be called if the user is already logged into Facebook - if we
             * invoke the FB.login API through code rather than the integrated FB button,
             * the login dialog will be a pop-up rather than an iframe.
             */
            faceBookLogin: function(scope){
                console.log(FB)
                FB.getLoginStatus(function (response) {
                    if (response.status === 'connected') {
                        console.log('test')
                        scope.fbLoggedIn = true;
                        AuthenticationService.onFbLogin(scope, response.authResponse.accessToken);
                    } else {
                        console.log('test')
                        // fallback logic only
                        scope.fbLoggedIn = false;
                        FB.login();
                    }
                });

            },

            initFBAPI: function(scope, modalinstance)
            {
                try {
                    if (scope.fbAppId) {

                        // load Facebook SDK
                        $window.fbAsyncInit = function () {
                            FB.init({
                                appId: settings.facebookAppId,
                                xfbml: false,
                                version: 'v2.2'
                            });

                            // Catch "login" events as the user logs in through the FB login dialog which is shown by the FB SDK
                            FB.Event.subscribe('auth.statusChange', function (response) {
                                if (response.status === 'connected') {
                                    AuthenticationService.onFbLogin(scope, response.authResponse.accessToken, modalinstance);
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

                    }
                } catch (e) {
                    console.error('Unable to initialize Facebook API');
                    console.error(e);
                }
            },

            onFbLogin: function(scope, fbToken, modalInstance){
                AuthenticationService.socialLogin('facebook', fbToken).then(function () {
                    if(!_.isUndefined(modalInstance))
                    {
                        modalInstance.close();
                    }
                    /* jshint ignore:start */
                    try {
                        FB.api('/me', function (response) {
                            SessionSvc.afterSocialLogin({email: response.email, firstName: response.first_name, lastName: response.last_name });
                        });
                    } catch (error){
                        console.error('Unable to load FB user profile');
                    }
                    /* jshint ignore:end */
                }, function () {
                    scope.errors.signin.push('LOGIN_FAILED');
                });
            },

            onGoogleLogin: function(gToken, scope, modalInstance){

                AuthenticationService.socialLogin('google', gToken).then(function () {
                    // close the modal if it's been passed
                    if(!_.isUndefined(modalInstance))
                    {
                        modalInstance.close();
                    }
                    try {
                        window.gapi.client.load('plus', 'v1').then(function () {
                            window.gapi.client.plus.people.get({
                                'userId': 'me'
                            }).then(function (response) {
                                if (response.result) {
                                    SessionSvc.afterSocialLogin({email: response.result.emails[0].value, firstName: response.result.name.givenName,
                                        lastName: response.result.name.familyName});
                                }

                            });
                        });
                    } catch (error){
                        console.error('Unable to load Google+ user profile');
                    }
                }, function () {
                    scope.errors.signin.push('LOGIN_FAILED');
                });

            },

            fbParse: function(){
                if (typeof FB !== 'undefined') {
                    FB.XFBML.parse();
                }
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
                            if(type !== undefined){
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
                        if(type !== undefined){
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

            /** Issues a 'change reset' request via email/link with token.  Returns the promise of the completed action.
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

            /** Modifies the password for an authenticated user.*/
            updatePassword: function(oldPassword, newPassword, email) {
                var payload = {
                    currentPassword: oldPassword,
                    newPassword: newPassword,
                    email: email
                };
                return AuthREST.Customers.all('password').all('change').customPOST(payload);
            },

            /** Performs login logic following login through social media login.*/
            socialLogin: function (providerId, token) {
                return AuthREST.Customers.one('login', providerId).customPOST({accessToken: token}).then(function (response) {
                    // passing static username to trigger 'is authenticated' validation of token
                    TokenSvc.setToken(response.accessToken, 'social');
                    SessionSvc.afterLogIn();
                });
            }

        };
        return AuthenticationService;

    }]);