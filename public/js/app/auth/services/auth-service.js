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