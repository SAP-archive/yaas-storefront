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
    .factory('AuthSvc', ['AuthREST', 'settings', 'TokenSvc', '$q', '$http', 'GlobalData', function (AuthREST, settings, TokenSvc, $q, $http, GlobalData) {

        function getParameterByName(name, url) {
            name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
            var regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
                results = regex.exec(url);
            return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
        }

        var AuthenticationService = {

            signup: function (user) {
                return AuthREST.Customers.all('signup').customPOST(user);
            },

            customerSignin: function (user) {
                return AuthREST.Customers.all('login').customPOST(user, '', { apiKey: settings.apis.customers.apiKey });
            },

            anonymousSignin: function () {
                var deferred = $q.defer();
                var accountUrl = 'http://yaas-test.apigee.net/test/account/v1';

                $http.post(accountUrl + '/auth/anonymous/login?hybris-tenant=' + GlobalData.store.tenant, '')
                    .then(
                    function (data) {
                        console.log('login success');
                        var token = getParameterByName('access_token', data.headers('Location'));
                        deferred.resolve({ accessToken: token });
                    },
                    function (error) {
                        console.error('Unable to perform anonymous login:');
                        console.error(error);
                        deferred.reject(error);
                    }
                );

                return deferred.promise;
            },

            /**
             * Performs login (customer specific or anonymous) and updates the current OAuth token in the local storage.
             * Returns a promise for when that action has been performed.
             *
             * @param user JSON object (with email, password properties), or null for anonymous user.
             */
            signin: function (user) {
                var signInDone = $q.defer();

                var signinPromise = user ? this.customerSignin(user) : this.anonymousSignin();

                signinPromise.then(function (response) {
                    TokenSvc.setToken(response.accessToken, user ? user.email : null);
                    signInDone.resolve({});

                }, function(error){
                    signInDone.reject(error);
                });

                return signInDone.promise;
            },

            anonymousLoginAfterLogout: function(){
                TokenSvc.unsetToken(settings.accessTokenKey);
                return this.signin();
            },

            /** Logs the customer out and retrieves a new OAuth token for anonymous access.*/
            signout: function () {
                // promise is resolved once new anonymous token has been retrieved
                var signOutCompletedDeferred = $q.defer();
                var self = this;
                AuthREST.Customers.all('logout').customGET('', { accessToken: TokenSvc.getToken().getAccessToken() }).then(function(){
                    self.anonymousLoginAfterLogout().then(function(){
                        signOutCompletedDeferred.resolve({});
                    });
                }, function(error){
                    console.error('Logout failed:');
                    console.error(error);
                    // even after logout failure, proceed with token unset/anon login
                    self.anonymousLoginAfterLogout().then(function(error){
                        signOutCompletedDeferred.reject(error);
                    });
                });
                return signOutCompletedDeferred.promise;
            },



            isAuthenticated: function () {
                var token = TokenSvc.getToken();
                return !!token.getAccessToken() && !!token.getUsername();
            }
        };
        return AuthenticationService;

    }]);