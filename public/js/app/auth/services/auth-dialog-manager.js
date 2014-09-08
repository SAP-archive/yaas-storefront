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
    .factory('AuthDialogManager', ['$modal', '$location', 'settings', '$q',
        function($modal, $location, settings, $q){

            var authDialog, isOpened = false;

            function cleanUp() {
                $location.search(settings.forgotPassword.paramName, null);
            }

            function onDialogClosed(callback) {
                isOpened = false;
                cleanUp();
                if(callback){
                    callback();
                }
            }


            return {

                isOpened: function() {
                    return isOpened;
                },
                
                /**
                 * Creates and opens the authorization dialog, optionally with the "forgot password" feature.
                 * Returns the promise returned by $modal.result (see angular bootstrap) - the success handler will
                 * be invoked if the the dialog was closed and the "reject" handler will be invoked if the dialog was
                 * dismissed.
                 */
                open: function(dialogConfig, options) {
                    var deferResult = $q.defer();
                    var modalOpts = angular.extend({
                            templateUrl: './js/app/auth/templates/auth.html',
                            controller: 'AuthModalDialogCtrl'
                        }, dialogConfig || {});

                    if (options && options.required) {
                        modalOpts.keyboard = false;
                        modalOpts.backdrop = 'static';
                    } else if (options && options.forgotPassword) {
                        modalOpts.templateUrl = './js/app/auth/templates/password.html';
                    }

                    // make sure only 1 instance exists in opened state
                    if (authDialog && isOpened) {
                        authDialog.close();
                    }
                    authDialog = $modal.open(modalOpts);
                    isOpened = true;
                    
                    authDialog.result.then(
                        // dialog closed
                        function(success) {
                            onDialogClosed();
                            deferResult.resolve(success);
                        },
                        // dialog dismissed
                        function(error) {
                            onDialogClosed();
                            deferResult.reject(error);
                        }
                    );
                    return deferResult.promise;
                },

                close: function() {
                    if (authDialog && isOpened) {
                        authDialog.close();
                        isOpened = false;
                    }
                }


            };

        }
    ]);