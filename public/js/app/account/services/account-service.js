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
    .factory('AccountSvc', ['AuthREST', 'settings', '$q', function(AuthREST, settings, $q){

        var AccountSvc = {

            /**
             * Retrieve account details of logged in customer.
             */
            account: function() {
                return AuthREST.Customers.all('me').customGET();
            },

            updateAccount: function(account) {
                return AuthREST.Customers.all('me').customPUT(account, '');
            },

            /**
             * Retrieve addresses of logged in customer.
             */
            getAddresses: function() {
                return AuthREST.Customers.all('me').all('addresses').getList();
            },

            /**
             * Retrieve specified address of logged in customer.
             */
            getAddress: function(id) {
                return AuthREST.Customers.all('me').one('addresses', id).get();
            },

            /**
             * Retrieve default address of logged in customer.
             */
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

            /**
             * Save addresses within logged in customer's address book.
             */
            saveAddress: function(address) {
                var promise = address.id ? AuthREST.Customers.all('me').all('addresses').customPUT(address, address.id) : AuthREST.Customers.all('me').all('addresses').customPOST(address);
                return promise;
            },

            /**
             * Remove specified address from logged in customer's address book.
             */
            removeAddress: function(address) {
                return AuthREST.Customers.all('me').one('addresses', address.id).customDELETE();
            }

        };

        return AccountSvc;

    }]);