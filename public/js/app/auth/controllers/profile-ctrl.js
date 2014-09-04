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
    .controller('ProfileCtrl', ['$scope', '$state', 'addresses', 'profile', 'AuthSvc', '$modal', function($scope, $state, addresses, profile, AuthSvc, $modal) {
        
        var modalInstance;
        var customerNumber = profile.customerNumber;

        var getDefaultAddress = function() {
          return _.find($scope.addresses, function(addr) { return addr.isDefault; });
        };

        $scope.errors = [];
        $scope.profile = profile;
        $scope.addresses = addresses;
        $scope.defaultAddress = getDefaultAddress();

        $scope.currencies = {
          'DE': 'EUR - Euro',
          'US': 'US - Dollar'
        };
        $scope.languageLocales = {
          'en_US': 'US - USA',
          'de_DE': 'DE - German'
        };

        var extractServerSideErrors = function(response) {
          var errors = [];
          if (response.status === 400) {
            if (response.data && response.data.details && response.data.details.length) {
              errors = response.data.details;
            }
          } else if (response.status === 403 || response.status === 409 || response.status === 401 || response.status === 404 || response.status === 500) {
            if (response.data && response.data.message) {
              errors.push({ message: response.data.message });
            }
          }
          return errors;
        };

        $scope.save = function(address, formValid, form) {
          $scope.$broadcast('submitting:form', form);
          if (formValid) {
            AuthSvc.saveAddress(address).then(
                function() {
                  console.log('Save address Success: ', arguments);
                  modalInstance.close();
                },
                function(response) {
                  console.log('Save address Errors: ', arguments);
                  $scope.errors = extractServerSideErrors(response);
                }
              );
          } else {
              $scope.showPristineErrors = true;
          }
        };

        $scope.openAddressModal = function(address) {
          $scope.address = angular.copy(address || {
            account: customerNumber
          });
          $scope.showPristineErrors = false;
          $scope.errors = [];
          modalInstance = $modal.open({
                templateUrl: './js/app/auth/templates/address-form.html',
                scope: $scope
              });

              modalInstance.result.then(function () {
                $scope.refreshAddresses();
              });
        };

        $scope.closeAddressModal = function() {
          modalInstance.close();
        };

        $scope.removeAddress = function(address) {
          address.account = customerNumber;
          if (window.confirm('Are you sure you want to remove the address?')) {
            AuthSvc.removeAddress(address).then(
              function() {
                console.log('Remove address Success: ', arguments);
                $scope.refreshAddresses();
              },
              function(response) {
                console.log('Remove address Errors: ', arguments);
                $scope.errors = extractServerSideErrors(response);
              }
            );
          }
        };

        $scope.refreshAddresses = function() {
          AuthSvc.getAddresses().then(function(addresses) {
            $scope.addresses = addresses;
            $scope.defaultAddress = getDefaultAddress();
          });
        };

        $scope.setAddressAsDefault = function(address) {
          address.isDefault = true;
          address.account = customerNumber;
          AuthSvc.saveAddress(address).then(
              function() {
                console.log('Save address as default Success: ', arguments);
                $scope.refreshAddresses();
              },
              function(response) {
                console.log('Save address as default Errors: ', arguments);
                $scope.errors = extractServerSideErrors(response);
              }
            );
        };

    }]);