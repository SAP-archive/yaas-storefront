/**
 * [y] hybris Platform
 *
 * Copyright (c) 2000-2015 hybris AG
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of hybris
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with hybris.
 */

'use strict';
angular.module('ds.auth')
    /** Encapsulates the logic for what needs to happen once a user is logged in or logged out.*/
    .factory('SessionSvc', ['AccountSvc', 'CartSvc', 'GlobalData', '$state', '$stateParams', 'settings', '$rootScope', '$q',
        function (AccountSvc, CartSvc, GlobalData, $state, $stateParams, settings, $rootScope, $q) {

            function navigateAfterLogin(context){
                if(context && context.targetState){
                    $state.go(context.targetState, context.targetStateParams || {});
                }
            }

            function commonPostLogin(context){
                var deferred = $q.defer();
                CartSvc.refreshCartAfterLogin(GlobalData.customerAccount.id).then(
                    function () {
                        deferred.resolve();
                    },
                    function () {
                        deferred.reject();
                    }
                );
                navigateAfterLogin(context);
                return deferred.promise;
            }


        return {

            afterLoginFromSignUp: function (context) {
                var deferred = $q.defer();
                AccountSvc.account().then(function () {
                    //Customer login event
                    $rootScope.$emit('customer:login', {});
                }).then(function(){
                    commonPostLogin(context).then(
                        function () {
                            deferred.resolve();
                        },
                        function () {
                            deferred.reject();
                        }
                    );
                });
                return deferred.promise;
            },

            /** Performs application logic for the scenario of a successful login.
             * @param context - optional configuration instance with the following optional properties:
             * - fromSignUp - set to true if this login followed the creation of a new account
             * - targetState - state to navigate to once additional configuration has taken place
             * - targetStateParams - state params to go with the targetState
             * */
            afterLogIn: function (context) {
                var deferred = $q.defer();
                // there must be an account
                AccountSvc.account().then(function (account) {
                    //Customer login event
                    $rootScope.$emit('customer:login', {});
                    return account;
                }).finally(function () {
                    commonPostLogin(context).then(
                        function () {
                            deferred.resolve();
                        },
                        function () {
                            deferred.reject();
                        }
                    );
                });
                return deferred.promise;
            },

            afterLogOut: function(){
                GlobalData.customerAccount = null;
                CartSvc.resetCart();

                $rootScope.$broadcast('coupon:logout');

                if ( $state.is('base.checkout.details') || ( $state.current.data && $state.current.data.auth && $state.current.data.auth === 'authenticated')) {
                    $state.go(settings.homeState);
                }
            },

            /**
             * Updates the current account profile with data from the social login profile, if properties
             * have not yet been set in the profile.
             * @param profile object with properties "firstName", "lastName", "email"
             */
            afterSocialLogin: function(profile){
                if(profile.email || profile.firstName || profile.lastName){
                    AccountSvc.getCurrentAccount().then(function (accResult) {
                        var updated = false;
                        if(!accResult.firstName && !accResult.lastName){
                            accResult.firstName = profile.firstName;
                            accResult.lastName = profile.lastName;
                            updated = true;
                        }
                        if(!accResult.contactEmail && profile.email){
                            accResult.contactEmail = profile.email;
                            updated = true;
                        }
                        if(updated) {
                            AccountSvc.updateAccount(accResult);
                        }
                    });
                }

            }


        };
    }]);
