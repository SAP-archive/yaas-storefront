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
    .factory('AuthSvc', ['AuthREST', 'settings', 'CookiesStorage', '$q', function(AuthREST, settings, Storage, $q){

        var AuthenticationService = {

            signup: function (user) {
                return AuthREST.Customers.all('signup').customPOST(user);
            },

            customerSignin: function(user) {
                return AuthREST.Customers.all('login').customPOST(user, '', { apiKey: settings.apis.customers.apiKey });
            },

            anonymousSignin: function() {
                return AuthREST.Customers.all('login').all('anonymous').customGET('', { apiKey: settings.apis.customers.apiKey });
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
                // Dummy implementation
                var deferred = $q.defer();

                setTimeout(function() {
                    deferred.resolve({
                        customerNumber: 'C123456',
                        title: 'Dr.',
                        firstName: 'Max',
                        middleName: 'Simon',
                        lastName: 'Muster',
                        contactEmail: 'noreply@hybris.com',
                        contactPhone: '+1 1111 2222 3333',
                        preferredLanguage: 'en_US',
                        preferredCurrency: 'US'
                    });
                }, 300);

                return deferred.promise;
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
            }

        };

        return AuthenticationService;

    }]);