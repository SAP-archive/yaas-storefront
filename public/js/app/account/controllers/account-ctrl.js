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

angular.module('ds.account')

    .controller('AccountCtrl', ['$scope', '$state', 'addresses', 'account', 'orders', 'OrderListSvc', 'AccountSvc', '$modal', '$filter', 'GlobalData', '$translate', 'AuthDialogManager',

        function ($scope, $state, addresses, account, orders, OrderListSvc, AccountSvc, $modal, $filter, GlobalData, $translate, AuthDialogManager) {

            var modalInstance;
            var customerNumber = account.customerNumber;
            var notSet = '';
            $translate('NOT_SET').then(function(value){
                notSet = value;
            });
            var getDefaultAddress = function () {
                return _.find($scope.addresses, function (addr) {
                    return addr.isDefault;
                });
            };

            $scope.errors = [];
            $scope.account = account;
            $scope.addresses = addresses;
            $scope.orders = orders;
            $scope.defaultAddress = getDefaultAddress();

            // show more or less addresses.
            $scope.showAddressDefault = 6;
            $scope.showAddressButtons = ($scope.addresses.length >= $scope.showAddressDefault);
            $scope.showAllAddressButton = true;
            $scope.showAddressFilter = $scope.showAddressDefault;

            // show more or less orders.
            $scope.showOrdersDefault = 10;
            $scope.showAllOrdersButton = true;
            $scope.showOrderButtons = ($scope.orders.length >= $scope.showOrdersDefault);
            $scope.showOrdersFilter = $scope.showOrdersDefault;

            $scope.currencies = GlobalData.getAvailableCurrency();

            $scope.showCurrency = function () {
                var selected = $filter('filter')($scope.currencies, {id: $scope.account.preferredCurrency ? $scope.account.preferredCurrency : '?'});
                return (selected && selected.length) ? selected[0].label : notSet;
            };

            $scope.languageLocales = GlobalData.getAvailableLanguages();

            $scope.showLanguageLocale = function () {
                $scope.account.preferredLanguage = $scope.account.preferredLanguage.split('_')[0];
                var selected = $filter('filter')($scope.languageLocales, {id: $scope.account.preferredLanguage ? $scope.account.preferredLanguage : '?'});
                return (selected && selected.length) ? selected[0].label : notSet;
            };

            $scope.titles = [];
            var titlesToTranslate = ['MR', 'MS', 'MRS', 'DR'];

            /*
             need to translate titles on page load
             */
            angular.forEach(titlesToTranslate, function (title) {
                $translate(title).then(function (translatedValue) {
                    $scope.titles.push(translatedValue);
                });
            });


            var extractServerSideErrors = function (response) {
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

            // handle dialog dismissal if user select back button, etc
            $scope.$on('$destroy', function () {
                if (modalInstance) {
                    modalInstance.dismiss('cancel');
                }
            });

            $scope.save = function (address, formValid, form /*,formObj*/) {
                // console.log('AddrForm', formObj.$error.required); // Important debug for dynamic form validation.
                $scope.$broadcast('submitting:form', form);
                if (formValid) {
                    AccountSvc.saveAddress(address).then(
                        function () {
                            modalInstance.close();
                        },
                        function (response) {
                            $scope.errors = extractServerSideErrors(response);
                        }
                    );
                } else {
                    $scope.showPristineErrors = true;
                }
            };

            $scope.saveOnEnter = function ($event, address, formValid, form) {
                if ($event.keyCode === 13) {
                    $event.preventDefault();
                    $scope.save(address, formValid, form);
                }
            };

            $scope.openAddressModal = function (address) {
                var fullName = '';
                if ($scope.account.firstName) {
                    fullName = fullName + $scope.account.firstName + ' ';
                }
                if ($scope.account.middleName) {
                    fullName = fullName + $scope.account.middleName + ' ';
                }
                if ($scope.account.lastName) {
                    fullName = fullName + $scope.account.lastName;
                }
                $scope.address = angular.copy(address || {
                    account: customerNumber,
                    contactName: fullName
                });
                $scope.showPristineErrors = false;
                $scope.errors = [];
                modalInstance = $modal.open({
                    templateUrl: './js/app/account/templates/address-form.html',
                    scope: $scope,
                    backdrop: 'static'
                });

                modalInstance.opened.then(function() {
                    setTimeout(function() {
                        // once dialog is open initialize dynamic localized address.
                        $scope.$emit('localizedAddress:updated', address.country, 'addAddress');
                    }, 10);
                });

                modalInstance.result.then(function () {
                    $scope.refreshAddresses();
                });
            };

            $scope.closeAddressModal = function () {
                modalInstance.close();
            };

            $scope.removeAddress = function (address) {
                address.account = customerNumber;

                $translate('CONFIRM_ADDRESS_REMOVAL').then(function( msg){
                    if (window.confirm(msg)) {
                        AccountSvc.removeAddress(address).then(
                            function () {
                                $scope.refreshAddresses();
                            },
                            function (response) {
                                $scope.errors = extractServerSideErrors(response);
                            }
                        );
                    }
                });

            };

            $scope.refreshAddresses = function () {
                AccountSvc.getAddresses().then(function (addresses) {
                    $scope.addresses = addresses;
                    $scope.defaultAddress = getDefaultAddress();
                    $scope.showAddressButtons = ($scope.addresses.length > $scope.showAddressDefault);
                    $scope.showAllAddressButton = ($scope.addresses.length > $scope.showAddressFilter-1);
                });
            };

            $scope.setAddressAsDefault = function (address) {
                address.isDefault = true;
                address.account = customerNumber;
                AccountSvc.saveAddress(address).then(
                    function () {
                        $scope.refreshAddresses();
                    },
                    function (response) {
                        $scope.errors = extractServerSideErrors(response);
                    }
                );
            };


            $scope.showAllOrders = function () {
                $scope.showAllOrdersButton = !$scope.showAllOrdersButton;

                var parms = {
                    pageSize: 100
                };
                OrderListSvc.query(parms).then(function (orders) {
                    $scope.orders = orders;

                    // show filtered list or show all orders. Hide if all data is shown within filter.
                    $scope.showOrdersFilter = $scope.showAllOrdersButton ? $scope.showOrdersDefault : $scope.orders.length;
                    $scope.showOrderButtons = ($scope.orders.length > $scope.showOrdersDefault);

                });
            };

            $scope.showAllAddresses = function () {
                $scope.showAllAddressButton = !$scope.showAllAddressButton;

                var parms = {
                    pageSize: GlobalData.addresses.meta.total
                };
                AccountSvc.getAddresses(parms).then(function (addresses) {
                    $scope.addresses = addresses;

                    // show filtered list or show all addresses. Hide if all data is shown within filter.
                    $scope.showAddressFilter = $scope.showAllAddressButton ? $scope.showAddressDefault : $scope.addresses.length;
                    $scope.showAddressButtons = ($scope.addresses.length > $scope.showAddressDefault);
                });
            };

            $scope.updateAccount = function (field, data) {
                var account = angular.copy($scope.account);
                var emailRegexp = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
                if (field === 'contactEmail' && !emailRegexp.test(data)) {
                    return $translate('PLEASE_ENTER_VALID_EMAIL');
                }
                account[field] = data;
                return AccountSvc.updateAccount(account).then(function () {
                    if (field === 'preferredLanguage' && data) {
                        GlobalData.setLanguage(data.split('_')[0]);
                    }
                    if (field === 'preferredCurrency' && data) {
                        GlobalData.setCurrency(data.split('_')[0]);
                    }
                });
            };

            $scope.updatePassword = function () {
                AuthDialogManager.showUpdatePassword();
            };

            /*
             need to set the currency symbol for each order
             */
            angular.forEach($scope.orders, function (order) {
                order.currencySymbol = GlobalData.getCurrencySymbol(order.currency);
            });

        }]);
