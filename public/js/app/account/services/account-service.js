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
angular.module('ds.account')
    .factory('AccountSvc', ['AuthREST', 'settings', 'CookiesStorage', '$q', function(AuthREST, settings, Storage, $q){

        var AccountSvc = {

            /**
             * Mehtod resturing logged in user account details.
             */
            // TODO: replace with actual implementation (once ApiGee is in place)
            account: function() {
                return AuthREST.Customers.all('me').customGET();
            },

            /**
             * Mehtod resturing logged in user addresses or only specified address
             */
            // TODO: replace with actual implementation (once ApiGee is in place)
            getAccountAddresses: function(addressId) {
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

        return AccountSvc;

    }]);