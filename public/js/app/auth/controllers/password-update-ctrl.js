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

angular.module('ds.auth')
    /**
     *  Displays the "indicate new password" page.
     */
    .controller('PasswordUpdateCtrl', ['$scope', 'AuthDialogManager', 'AuthSvc', '$state', '$stateParams', 'TokenSvc', '$modalInstance',
        function($scope, AuthDialogManager, AuthSvc, $state, $stateParams, TokenSvc, $modalInstance) {
            $scope.token = $stateParams.token || '';
            $scope.showPristineErrors = false;
            $scope.submitDisabled = false;
            $scope.message = null;
            $scope.errors = [];

            $scope.showAllErrors = function(){
                $scope.showPristineErrors = true;
                return true;
            };

            $scope.changePassword = function(token, password) {
                $scope.submitDisabled = true;
                $scope.message = null;

                AuthSvc.changePassword(token, password).then( function(){
                    var dlgPromise = AuthDialogManager.showPasswordChanged();
                    dlgPromise.then(function() {
                           // won't be called
                        },
                        function(){ // on dismiss - only option
                            var loginPromise = AuthDialogManager.open();
                            loginPromise.then(function(){
                                $state.transitionTo('base.category', $stateParams, {
                                    reload: true,
                                    inherit: true,
                                    notify: true
                                });
                            }, function(){
                                $state.transitionTo('base.category', $stateParams, {
                                    reload: true,
                                    inherit: true,
                                    notify: true
                                });
                            });

                        }
                    );
                }, function(error){
                    $scope.submitDisabled = false;
                    var details = 'No details provided';
                    if(error.data && error.data.message) {
                        details = error.data.message;
                    }
                    $scope.message = 'Update of password failed: '+details;
                });
            };

            $scope.updatePassword = function(oldPassword, newPassword) {
                $scope.submitDisabled = true;
                $scope.errors = [];

                AuthSvc.updatePassword(oldPassword, newPassword, TokenSvc.getToken().getUsername() || '').then(
                    function() {
                        $modalInstance.close();
                    },
                    function(error){
                        $scope.submitDisabled = false;

                        if (error.status === 401) {
                            $scope.errors.push({ message: 'WRONG_CURRENT_PASSWORD' });
                        } else if(error.data && error.data.message) {
                            $scope.errors.push({ message: error.data.message });
                        }
                    }
                );
            };

            $scope.clearErrors = function(){
                $scope.message = '';
            };

    }]);