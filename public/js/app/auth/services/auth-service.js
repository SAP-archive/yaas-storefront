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
    .factory('AuthSvc', ['AuthREST', 'settings', 'TokenSvc', '$q', '$http', 'storeConfig', function(AuthREST, settings, TokenSvc, $q, $http, storeConfig){

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

            customerSignin: function(user) {
                return AuthREST.Customers.all('login').customPOST(user, '', { apiKey: settings.apis.customers.apiKey });
            },
            
            anonymousSignin: function() {
                var deferred = $q.defer();
                var accountUrl = 'http://yaas-test.apigee.net/test/account/v1';
                
                $http.post(accountUrl + '/auth/anonymous/login?hybris-tenant=' + storeConfig.storeTenant, '')
                    .then(
                    function (data) {
                        console.log('login success');
                        var token = getParameterByName('access_token', data.headers('Location'));
console.log('token is '+token);
                        storeConfig.token = token;
console.log(storeConfig);
                        var response = { accessToken: token };
                        TokenSvc.setToken(response, null);
                        deferred.resolve(response);
                    },
                    function (error) {
                        console.error('Unable to perform anonymous login:');
                        console.error(error);
                        deferred.resolve(error);
                    }
                );

                return deferred.promise;
            },

            /**
             * Sign in promise resolver function used for resolving the type of signin
             * If user parameter is not provided than anonymous login will be performed, otherwise it'll initiate customer signup with provided credentials.
             * 
             * @param user JSON object (with email, password properties) 
             */
            signin: function (user) {
                var signinPromise = user ? this.customerSignin(user) : this.anonymousSignin();
                
                signinPromise.then(function(response) {
                    TokenSvc.setToken(response.accessToken, user ? user.email : null);
                });

                return signinPromise;
            },

            signout: function() {
                var signoutPromise = AuthREST.Customers.all('logout').customGET('', { accessToken: TokenSvc.getToken().getAccessToken() }),
                    self = this;
                
                signoutPromise.then(function() {
                    TokenSvc.unsetToken(settings.accessTokenKey);
                    self.signin();  // Obtain access_token as anonymous user
                });

                return signoutPromise;
            },

            isAuthenticated: function() {
                var token = TokenSvc.getToken();
                return !!token.getAccessToken() && !!token.getUsername();
            }
        };
        return AuthenticationService;

    }]);