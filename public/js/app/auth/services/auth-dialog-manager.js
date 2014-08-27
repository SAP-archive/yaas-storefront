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
    .factory('AuthDialogManager', ['$modal',
        function($modal){

            var authDialog, isOpened = false;

            return {

                isOpened: function() {
                    return isOpened;
                },
                
                /**
                 * Creates and opens the authorization dialog (having provided configuration in mind)
                 */
                open: function(dialogConfig, options) {
                    var modalOpts = angular.extend({
                            templateUrl: 'public/js/app/auth/templates/auth.html',
                            controller: 'AuthModalDialogCtrl'
                        }, dialogConfig || {});

                    if (options && options.required) {
                        modalOpts.keyboard = false;
                        modalOpts.backdrop = 'static';
                    }

                    // make sure only 1 instance exists in opened state
                    if (authDialog && isOpened) {
                        authDialog.close();
                    }
                    authDialog = $modal.open(modalOpts);
                    isOpened = true;

                    authDialog.result.then(
                        function() {
                            isOpened = false;
                        },
                        function() {
                            isOpened = false;
                        }
                    );
                    
                    return authDialog;
                },

                close: function() {
                    if (authDialog && isOpened) {
                        authDialog.close();
                    }
                }

            };

        }
    ]);