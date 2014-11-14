/**
 * Created by i839794 on 10/9/14.
 */
'use strict';
angular.module('ds.auth')
    /** Encapsulates the logic for what needs to happen once a user is logged i or logged out.*/
    .factory('SessionSvc', ['AccountSvc', 'CartSvc', 'GlobalData', '$state', '$stateParams', 'settings',
        function (AccountSvc, CartSvc, GlobalData, $state, $stateParams, settings) {

            function navigateAfterLogin(context){
                if(context && context.targetState){
                    $state.go(context.targetState, context.targetStateParams || {});
                }
            }

            function commonPostLogin(context){
                CartSvc.refreshCartAfterLogin(GlobalData.customerAccount.id);
                navigateAfterLogin(context);
            }


        return {

            afterLoginFromSignUp: function (context) {
                AccountSvc.account().then(function (account) {
                    account.preferredCurrency = GlobalData.getCurrencyId();
                    account.preferredLanguage = GlobalData.getLanguageCode();
                    AccountSvc.updateAccount(account);
                }).then(function(){
                   commonPostLogin(context);
                });
            },

            /** Performs application logic for the scenario of a successful login.
             * @param context - optional configuration instance with the following optional properties:
             * - fromSignUp - set to true if this login followed the creation of a new account
             * - targetState - state to navigate to once additional configuration has taken place
             * - targetStateParams - state params to go with the targetState
             * */
            afterLogIn: function (context) {

                // there must be an account
                AccountSvc.account().then(function (account) {
                    if (account.preferredLanguage) {
                        GlobalData.setLanguage(account.preferredLanguage.split('_')[0]);
                    }
                    if (account.preferredCurrency) {
                        GlobalData.setCurrency(account.preferredCurrency);
                    }
                    return account;
                }).finally(function () {
                   commonPostLogin(context);
                });
            },

            afterLogOut: function(){
                GlobalData.customerAccount = null;
                CartSvc.resetCart();
                if ( $state.is('base.checkout.details') || ( $state.current.data && $state.current.data.auth && $state.current.data.auth === 'authenticated')) {
                    $state.go(settings.homeState);
                }
            }
        };
    }]);
