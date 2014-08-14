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
 *  Encapsulates access to the "authorization" service.
 */
angular.module('ds.auth')
    .factory('AuthSvc', ['AuthREST', 'settings', 'CookiesStorage', function(AuthREST, settings, Storage){

        return {

            signup: function (user) {
                return AuthREST.Customers.all('signup').customPOST(user);
            },

            signin: function (user) {
                var signinPromise = AuthREST.Customers.all('login').customPOST(user, '', { apiKey: settings.apis.customers.apiKey });
                
                signinPromise.then(function(response) {
                    Storage.setToken(response.accessToken, user.email);
                });

                return signinPromise;
            },

            signout: function() {
                var signoutPromise = AuthREST.Customers.all('logout').customGET('', { accessToken: Storage.getToken().getAccessToken() });
                
                signoutPromise.then(function() {
                    Storage.unsetToken(settings.accessTokenKey);
                });

                return signoutPromise;
            },

            setToken: Storage.setToken,

            getToken: Storage.getToken,

            isAuthenticated: function() {
                return !!Storage.getToken().getAccessToken();
            }

        };

    }]);