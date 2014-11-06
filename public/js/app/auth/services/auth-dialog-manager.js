/*
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

/** Authorization manager.  */
angular.module('ds.auth')
    .factory('AuthDialogManager', ['$modal', '$location', 'settings', '$q', '$window', 'AuthSvc',
        function($modal, $location, settings, $q, $window, AuthSvc){

            var authDialog;

            function closeDialog(){
                if (authDialog ) {
                    try {
                        authDialog.close();
                    } catch (err){

                    }
                }
            }

            function initFB(){
                try {
                    $window.fbAsyncInit = function () {
                        FB.init({
                            appId: settings.facebookAppId,
                            xfbml: false,
                            version: 'v2.1'
                        });

                        FB.Event.subscribe('auth.statusChange', function (response) {
                            console.log('FB status is ' + response.status);
                            if (response.status === 'connected') { // The person is logged into Facebook, and has logged into the store/"app"
                                closeDialog();
                                AuthSvc.socialLogin('facebook', response.authResponse.accessToken).then(function () {
                                }, function (error) {
                                    window.alert(error);
                                });

                            } else if (response.status === 'not_authorized' || response.status === 'unknown') { // 'not_authorized' The person is logged into Facebook, but not into the app
                                if (AuthSvc.isAuthenticated()) {    //  'unknown'  The person is not logged into Facebook, so you don't know if they've logged into your app.
                                    AuthSvc.signOut();
                                }
                            }
                        });

                    };
                    (function (d, s, id) {
                        var js, fjs = d.getElementsByTagName(s)[0];
                        var fbElement = d.getElementById(id);
                        if (fbElement) {

                            return;
                        }
                        js = d.createElement(s);
                        js.id = id;
                        js.src = '//connect.facebook.net/en_US/sdk.js';
                        fjs.parentNode.insertBefore(js, fjs);
                    }(document, 'script', 'facebook-jssdk'));
                } catch (e){
                    console.error('Unable to initialize Facebook API');
                }
            }

            function openDialog(options) {
                initFB();

                var deferResult = $q.defer();
                // make sure only 1 instance exists in opened state
                closeDialog();
                authDialog = $modal.open(options);


                authDialog.result.then(
                    // dialog closed
                    function(success) {
                        deferResult.resolve(success);
                    },
                    // dialog dismissed
                    function(error) {
                        deferResult.reject(error);
                    }
                );
                return deferResult.promise;
            }

            return {

                /**
                 * Creates and opens the authorization dialog for sign in/create account.
                 * Returns the promise returned by $modal.result (see angular bootstrap) - the success handler will
                 * be invoked if the the dialog was closed and the "reject" handler will be invoked if the dialog was
                 * dismissed.
                 * @param dialogConfig
                 * @param dialogOptions
                 * @param loginOptions - options for "post login" processing, such as the target URL
                 */
                open: function(dialogConfig, dialogOptions, loginOptions) {

                    var modalOpts = angular.extend({
                            templateUrl: './js/app/auth/templates/auth.html',
                            controller: 'AuthModalDialogCtrl',
                            resolve: {
                                loginOpts: function() {
                                    return loginOptions || {};
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
                }


            };

        }
    ]);