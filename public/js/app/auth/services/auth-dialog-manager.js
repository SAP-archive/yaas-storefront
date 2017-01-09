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

/** Authorization manager.  */
angular.module('ds.auth')
    .factory('AuthDialogManager', ['$uibModal',
        function($uibModal){

            var authDialog;

            function closeDialog(){
                if (authDialog) {
                    try {
                        authDialog.close();
                    } catch (err){

                    }
                }
            }

            function openDialog(options) {
                // make sure only 1 instance exists in opened state
                closeDialog();
                authDialog = $uibModal.open(options);
                return authDialog.result;
            }

            return {


                /**
                 * Creates and opens the authorization dialog for sign in/create account.
                 * Returns the promise returned by $uibModal.result (see angular bootstrap) - the success handler will
                 * be invoked if the the dialog was closed and the "reject" handler will be invoked if the dialog was
                 * dismissed.
                 * @param dialogConfig
                 * @param dialogOptions
                 * @param loginOptions - options for "post login" processing, such as the target URL
                 */
                open: function(dialogConfig, dialogOptions, loginOptions, showContinueAsGuest) {

                    var modalOpts = angular.extend({
                            templateUrl: 'js/app/auth/templates/auth.html',
                            controller: 'AuthModalDialogCtrl',
                            resolve: {
                                loginOpts: function() {
                                    return loginOptions || {};
                                },
                                showAsGuest: function(){
                                    return showContinueAsGuest;
                                }
                            }
                        }, dialogConfig || {});

                    if (dialogOptions && dialogOptions.required) {
                        modalOpts.keyboard = false;
                        modalOpts.backdrop = 'static';
                    }
                    return openDialog(modalOpts);
                },

                close: function() {
                    closeDialog();
                },


                /** Shows the "reset password dialog.
                 * @param opts optional override for 'title' and 'msg'.
                 * */
                showResetPassword: function(opts){
                   var modalOpts = {
                       templateUrl: './js/app/auth/templates/password-request-reset.html',
                       controller: 'PasswordResetCtrl',
                       resolve:{
                           title: function(){return opts? opts.title : null;},
                           instructions: function(){return opts? opts.instructions : null;}
                       }
                   };
                   return openDialog(modalOpts);
                },

                /** Shows the "check your email" dialog. */
                showCheckEmail: function(){
                    var modalOpts = {
                        templateUrl: './js/app/auth/templates/check-email.html'
                    };
                    return openDialog(modalOpts);
                },

                /** Shows the 'password changed successfully' dialog. */
                showPasswordChanged: function(){
                    var modalOpts = {
                        templateUrl: './js/app/auth/templates/pw-change-success.html'
                    };
                    return openDialog(modalOpts);
                },

                /** Shows "update password" dialog for an authenticated user.*/
                showUpdatePassword: function(){
                    var modalOpts = {
                        templateUrl: './js/app/auth/templates/password-update.html',
                        controller: 'PasswordUpdateCtrl',
                        backdrop: 'static'
                    };
                    return openDialog(modalOpts);
                },

                showDeleteAccount: function () {
                    var modalOpts = {
                        templateUrl: 'js/app/account/templates/modals/delete-account-dialog.html',
                        controller: 'DeleteAccountDialogCtrl',
                        backdrop: 'static'
                    };
                    return openDialog(modalOpts);
                },

                showDeleteAccountConfirmRequest: function () {
                    var modalOpts = {
                        templateUrl: 'js/app/account/templates/modals/delete-account-confirm-request.html',
                        controller: 'DeleteAccountBasicCtrl',
                        resolve: {
                            success: function() {
                                return true;
                            }
                        }
                    };
                    return openDialog(modalOpts);
                },

                showDeleteAccountConfirmation: function (success) {
                    var modalOpts = {
                        templateUrl: 'js/app/account/templates/delete-account.html',
                        controller: 'DeleteAccountBasicCtrl',
                        resolve: {
                            success: function() {
                                return success;
                            }
                        }
                    };
                    return openDialog(modalOpts);
                }

            };

        }
    ]);