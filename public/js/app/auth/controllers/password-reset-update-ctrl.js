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
/**
 *  Displays the "indicate new password" page, to which the user will be linked after issuing a request to reset the password.
 *  Assumes that the stateParams provide the token that is required to make the service call.
 */
    .controller('ResetPasswordUpdateCtrl', ['$scope', 'AuthDialogManager', 'AuthSvc', '$state', '$stateParams',
        function ($scope, AuthDialogManager, AuthSvc, $state, $stateParams) {
            $scope.token = $stateParams.token || '';
            $scope.showPristineErrors = false;
            $scope.submitDisabled = false;
            $scope.error = {};
            $scope.showRetryLink =  false;

            $scope.showAllErrors = function () {
                $scope.showPristineErrors = true;
                return true;
            };

            $scope.changePassword = function (token, password) {
                $scope.submitDisabled = true;

                AuthSvc.changePassword(token, password).then(function () {
                    var dlgPromise = AuthDialogManager.showPasswordChanged();
                    dlgPromise.then(function () {
                            // won't be called
                        },
                        function () { // on dismiss - only option
                            var loginPromise = AuthDialogManager.open();
                            loginPromise.then(function () {
                                $state.transitionTo('base.category', $stateParams, {
                                    reload: true,
                                    inherit: true,
                                    notify: true
                                });
                            }, function () {
                                $state.transitionTo('base.category', $stateParams, {
                                    reload: true,
                                    inherit: true,
                                    notify: true
                                });
                            });

                        }
                    );
                }, function (error) {
                    $scope.submitDisabled = false;
                    if(error.status === 400 && error.data && error.data.message && error.data.message.toLowerCase().indexOf('invalid token')> -1) {

                        AuthDialogManager.showResetPassword({title: 'REQUEST_PW_EXPIRED', instructions:'REQUEST_PW_EXPIRED_MSG'});

                    } else {
                        $scope.showRetryLink = true;
                        $scope.error.message= 'PW_CHANGE_FAILED';
                        if (error.data && error.data.message) {
                            $scope.error.details = error.data.message;
                        }
                    }
                });
            };

            $scope.showRequestPasswordReset = function() {
                AuthDialogManager.showResetPassword();
            };

            $scope.clearErrors = function () {
                $scope.showPristineErrors = false;
                $scope.error.message = '';
                $scope.error.details = '';
            };

        }]);