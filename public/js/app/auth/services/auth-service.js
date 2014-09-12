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
    .factory('AuthSvc', ['AuthREST', 'settings', 'TokenSvc', '$state', '$q', function (AuthREST, settings, TokenSvc, $state, $q) {

        var AuthenticationService = {

            signup: function (user) {
                return AuthREST.Customers.all('signup').customPOST(user);
            },

            customerSignin: function (user) {
                return AuthREST.Customers.all('login').customPOST(user, '', { apiKey: settings.apis.customers.apiKey });
            },

            /**
             * Performs login (customer specific or anonymous) and updates the current OAuth token in the local storage.
             * Returns a promise with "success" = access token for when that action has been performed.
             *
             * @param user JSON object (with email, password properties), or null for anonymous user.
             */
            signin: function (user) {
                var signInDone = $q.defer();

                var signinPromise = this.customerSignin(user);

                signinPromise.then(function (response) {
                    TokenSvc.setToken(response.accessToken, user ? user.email : null);
                    signInDone.resolve(response.accessToken);

                }, function(error){
                    signInDone.reject(error);
                });

                return signInDone.promise;
            },

            /** Logs the customer out and removes the token cookie. */
            signOut: function () {
                AuthREST.Customers.all('logout').customGET('', { accessToken: TokenSvc.getToken().getAccessToken() });
                // unset token after logout - new anonymous token will be generated for next request automatically
                TokenSvc.unsetToken(settings.accessCookie);
                if ($state.is('base.account')) {
                    $state.go('base.product');
                }
            },

            /** Returns true if there is a user specific OAuth token cookie.*/
            isAuthenticated: function () {
                var token = TokenSvc.getToken();
                return !!token.getAccessToken() && !!token.getUsername();
            }
        };
        return AuthenticationService;

    }]);