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
 * Controller for handling authentication related modal dialogs (signUp/signIn).
 */
    .controller('AuthModalDialogCtrl', ['$rootScope', '$scope', '$modalInstance', '$controller', '$q', 'AuthSvc',
        'AccountSvc', 'CookieSvc', '$location', 'settings', 'AuthDialogManager', 'GlobalData',
        function ($rootScope, $scope, $modalInstance, $controller, $q, AuthSvc, AccountSvc, CookieSvc, $location,
                  settings, AuthDialogManager, GlobalData) {

            $scope.user = {
                signup: {},
                signin: {
                    email: '',
                    password: ''
                }
            };

            $scope.errors = {
                signup: [],
                signin: []
            };


            var performSignin = function (authModel, fromSignup) {
                var signInPromise = AuthSvc.signin(authModel);
                signInPromise.then(function () {
                    $scope.errors.signin = [];
                    var accountPromise = AccountSvc.account();
                    accountPromise.then(function () {
                        if (fromSignup) {
                            accountPromise.$object.preferredCurrency = GlobalData.storeCurrency;
                            accountPromise.$object.preferredLanguage = GlobalData.languageCode;
                            AccountSvc.updateAccount(accountPromise.$object);
                        }
                        else {
                            var languageCode = accountPromise.$object.preferredLanguage.split('_')[0];
                            var currency = accountPromise.$object.preferredCurrency;
                            $rootScope.$emit('language:switch', languageCode);
                            $rootScope.$emit('currency:switch', currency);
                            CookieSvc.setCurrencyCookie(currency);
                            CookieSvc.setLanguageCookie(languageCode);
                        }
                    });
                }, function (response) {
                    $scope.errors.signin = extractServerSideErrors(response);
                });
                return signInPromise;
            };

            var extractServerSideErrors = function (response) {
                var errors = [];
                if (response.status === 400 && response.data.details && response.data.details[0].field && response.data.details[0].field === 'password') {
                    errors.push({message: 'PASSWORD_INVALID'});
                } else if (response.status === 401 || response.status === 404) {
                    errors.push({ message: 'INVALID_CREDENTIALS' });
                } else if (response.status === 409) {
                    errors.push({ message: 'ACCOUNT_ALREADY_EXISTS' });
                } else if (response.status === 403) {
                    errors.push({ message: 'ACCOUNT_LOCKED' });
                } else if (response.data && response.data.details && response.data.details.message) {
                    errors.push(response.data.details.message);
                } else if (response.data && response.data.message) {
                    errors.push({ message: response.data.message });
                } else {
                    errors.push({message: response.status});
                }

                return errors;
            };

            /** Shows dialog that allows the user to create a new account.*/
            $scope.signup = function (authModel, signUpForm) {
                var deferred = $q.defer();

                if (signUpForm.$valid) {
                    AuthSvc.signup(authModel).then(
                        function () {
                            $scope.errors.signup = [];
                            performSignin(authModel, true).then(
                                function (response) {
                                    settings.hybrisUser = $scope.user.signup.email;
                                    $modalInstance.close(response);
                                    deferred.resolve(response);
                                },
                                function (response) {
                                    deferred.reject(response);
                                }
                            );
                        }, function (response) {
                            $scope.errors.signup = extractServerSideErrors(response);
                            deferred.reject({ message: 'Signup form is invalid!', errors: $scope.errors.signup });
                        }
                    );
                } else {
                    deferred.reject({ message: 'Signup form is invalid!'});
                }

                return deferred.promise;
            };

            /** Shows dialog that allows the user to sign in so account specific information can be accessed. */
            $scope.signin = function (authModel, signinForm) {
                var deferred = $q.defer();

                if (signinForm.$valid) {
                    performSignin(authModel).then(
                        function (response) {
                            settings.hybrisUser = $scope.user.signin.email;
                            $modalInstance.close(response);
                            deferred.resolve(response);
                        },
                        function (response) {
                            deferred.reject(response);
                        }
                    );
                } else {
                    deferred.reject({ message: 'Signin form is invalid!'});
                }
                return deferred.promise;
            };

            /** Closes the dialog. */
            $scope.continueAsGuest = function () {
                $modalInstance.close();
            };

            /** Shows the "request password reset" dialog.*/
            $scope.showResetPassword = function () {
                AuthDialogManager.showResetPassword();
            };

            $scope.clearErrors = function(){
                $scope.errors.signin = [];
                $scope.errors.signup = [];
            };


        }]);