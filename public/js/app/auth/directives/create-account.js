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
.directive('createAccount', ['AuthSvc', 'settings', '$rootScope', 'YGoogleSignin', function (AuthSvc, settings, $rootScope, YGoogleSignin) {
    return {
        link: function ($scope) {

            $scope.fbAppId = settings.facebookAppId;
            $scope.googleClientId = settings.googleClientId;
            AuthSvc.initFBAPI();
            AuthSvc.initGoogleAPI();

            $scope.errors = {
                signup: []
            };

            /** in page panel to create a new account.*/
            $scope.signup = function (signUpPw, signUpEmail, signUpForm) {
                var authModel = {
                    email: signUpEmail,
                    password: signUpPw
                };
                if (signUpForm.$valid) {
                    AuthSvc.signup(authModel).then( function () {
                            $scope.isAuthenticated = true;
                            $rootScope.$broadcast('confirmation:account');
                        }, function (response) {
                            $scope.errors.signup = AuthSvc.extractServerSideErrors(response);
                        }
                    );
                }
            };

            $scope.fbLogin = function () {
                AuthSvc.faceBookLogin();
            };

            $scope.googleLogin = function () {
                YGoogleSignin.login().then(function (user) {
                    AuthSvc.onGoogleLogIn(user);
                });
            };

        }
    };
}]);
