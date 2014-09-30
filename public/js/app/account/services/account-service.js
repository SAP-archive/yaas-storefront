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
    .factory('AccountSvc', ['AuthREST', 'settings', 'GlobalData', '$q', function(AuthREST, settings, GlobalData, $q){

        // create new random "customer id" for anonymous shopper
        var guid = (function() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }
            return function() {
                return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                    s4() + '-' + s4() + s4() + s4();
            };
        })();

        var AccountSvc = {

            /**
             * Retrieves the account details of logged-in customer and stores the result in the GlobalData service.
             * Returns a promise of the result.
             */
            account: function() {
                var promise = AuthREST.Customers.all('me').customGET();
                promise.then(function(success){
                   GlobalData.customerAccount = success.plain();
                });
                return promise;
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
            },

            /**
             * Returns a promise to the customer account in the local scope, or retrieves and sets the data if needed.
             */
            getCurrentAccount: function() {
                var defAccount = $q.defer();
                console.debug(GlobalData.customerAcount);
                if(GlobalData.customerAccount){
                    console.debug('use existing');
                    defAccount.resolve(GlobalData.customerAccount);
                } else if(GlobalData.user.isAuthenticated) {
                    console.debug('use account()');
                    this.account().then(function(success){
                        defAccount.resolve(success);
                    }, function(failure){
                        defAccount.reject(failure);
                    });
                } else {
                    console.debug('create fake');
                    var gId = guid();
                    GlobalData.customerAccount = {
                        customerNumber: gId,
                        id: gId
                    };
                    console.debug(GlobalData.customerAcount);
                    defAccount.resolve(GlobalData.customerAccount);
                }
                console.log(defAccount.promise);
                return defAccount.promise;

            }

        };

        return AccountSvc;

    }]);