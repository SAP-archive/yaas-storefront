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
    .factory('AuthSvc', ['AuthREST', 'settings', 'CookiesStorage', '$q', '$http', 'storeConfig', function(AuthREST, settings, Storage, $q, $http, storeConfig){

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

            // anonymousSignin: function() {
            //     return AuthREST.Customers.all('login').all('anonymous').customGET('', { apiKey: settings.apis.customers.apiKey });
            // },
            
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
                        Storage.setToken(response, null);
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
                    Storage.setToken(response.accessToken, user ? user.email : null);
                });

                return signinPromise;
            },

            signout: function() {
                var signoutPromise = AuthREST.Customers.all('logout').customGET('', { accessToken: Storage.getToken().getAccessToken() }),
                    self = this;
                
                signoutPromise.then(function() {
                    Storage.unsetToken(settings.accessTokenKey);
                    self.signin();  // Obtain access_token as anonymous user
                });

                return signoutPromise;
            },

            setToken: Storage.setToken,

            getToken: Storage.getToken,

            isAuthenticated: function() {
                var token = Storage.getToken();
                return !!token.getAccessToken() && !!token.getUsername();

            },

            /**
             * Mehtod resturing logged in user profile details.
             */
            // TODO: replace with actual implementation (once ApiGee is in place)
            profile: function() {
                return AuthREST.Customers.all('me').customGET();
            },

            /**
             * Mehtod resturing logged in user addresses or only specified address
             */
            // TODO: replace with actual implementation (once ApiGee is in place)
            getProfileAddresses: function(addressId) {
                var deferred = $q.defer(),
                    result = [{
                            address1: 'Hollywood Blwd.',
                            city: 'Los Angeles',
                            state: 'CA',
                            zip: '123456'
                        },
                        {
                            address1: 'Dead end walley',
                            city: 'New York',
                            state: 'New York',
                            zip: '111222'
                        }];

                if (addressId) {
                    result = result[0];
                }

                setTimeout(function() { deferred.resolve(result); }, 300);

                return deferred.promise;
            },

            getAddresses: function() {
                return AuthREST.Customers.all('me').all('addresses').getList();
            },

            getAddress: function(id) {
                return AuthREST.Customers.all('me').one('addresses', id).get();
            },

            getDefaultAddress: function() {
                var addresses = this.getAddresses(),
                    deferred = $q.defer();

                addresses.then(
                    function(addresses) {
                        deferred.resolve(_.find(addresses, function(adr) { return adr.isDefault; }));
                    }, function() {
                        deferred.reject();
                    });

                return deferred.promise;
            },

            saveAddress: function(address) {
                var promise = address.id ? AuthREST.Customers.all('me').all('addresses').customPUT(address, address.id) : AuthREST.Customers.all('me').all('addresses').customPOST(address);
                return promise;
            },

            removeAddress: function(address) {
                return AuthREST.Customers.all('me').one('addresses', address.id).customDELETE();
            }

        };

        return AuthenticationService;

    }]);