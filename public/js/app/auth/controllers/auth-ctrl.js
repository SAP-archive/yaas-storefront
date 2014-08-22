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
    .controller('AuthCtrl', ['$scope', 'AuthSvc', function($scope, AuthSvc) {
        
        $scope.user =  {
          signup: {},
          signin: {}
        };

        $scope.errors = {
          signup: [],
          signin: []
        };

        var performSignin = function(authModel) {
            AuthSvc.signin(authModel).then(function() {
                $scope.errors.signin = [];
              }, function(response) {
                $scope.errors.signin = extractServerSideErrors(response);
              });
        };

        var extractServerSideErrors = function(response) {
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

        $scope.signup = function(authModel, singupForm) {
          if (singupForm.$valid) {
            AuthSvc.signup(authModel).then(
                function() {
                  $scope.errors.signup = [];
                  performSignin(authModel);
                }, function(response) {
                  $scope.errors.signup = extractServerSideErrors(response);
                }
              );
          }
        };

        $scope.signin = function(authModel, singinForm) {
          if (singinForm.$valid) {
            performSignin(authModel);
          }
        };

    }]);