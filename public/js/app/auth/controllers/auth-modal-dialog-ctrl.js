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
    .controller('AuthModalDialogCtrl', ['$rootScope', '$scope', '$modalInstance', '$controller', '$q', 'AuthSvc', 'AccountSvc', 'CookieSvc', '$location', 'settings', 'AuthDialogManager',
        function ($rootScope, $scope, $modalInstance, $controller, $q, AuthSvc, AccountSvc, CookieSvc, $location, settings, AuthDialogManager) {

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


            var performSignin = function (authModel) {
                var signInPromise = AuthSvc.signin(authModel);
                signInPromise.then(function () {
                    $scope.errors.signin = [];
                    var accountPromise = AccountSvc.account();
                    accountPromise.then(function () {
                        var languageCode = accountPromise.$object.preferredLanguage.split('_')[0];
                        $rootScope.$emit('language:switch', languageCode);
                        CookieSvc.setLanguageCookie(languageCode);
                    });
                }, function (response) {
                    $scope.errors.signin = extractServerSideErrors(response);
                });
                return signInPromise;
            };

            var extractServerSideErrors = function (response) {
                var errors = [];
                if (response.status === 400) {
                    if (response.data && response.data.details && response.data.details.length) {
                        errors = response.data.details;
                    }
                } else if (response.status === 409 || response.status === 401 || response.status === 404 || response.status === 500) {
                    if (response.data && response.data.message) {
                        errors.push({ message: response.data.message });
                    }
                }
                return errors;
            };

            $scope.signup = function (authModel, signUpForm) {
                var deferred = $q.defer();

                if (signUpForm.$valid) {
                    AuthSvc.signup(authModel).then(
                        function () {
                            $scope.errors.signup = [];
                            performSignin(authModel).then(
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

            $scope.signin = function (authModel, signinForm) {
                var deferred = $q.defer();

                if (signinForm.$valid) {
                    performSignin(authModel).then(
                        function (response) {
                            settings.hybrisUser = $scope.user.signin.email;
                            console.log('email is '+$scope.user.signin.email);
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


            $scope.continueAsGuest = function () {
                $modalInstance.close();
            };

            $scope.showResetPassword = function () {
                AuthDialogManager.showResetPassword();
            };


        }]);