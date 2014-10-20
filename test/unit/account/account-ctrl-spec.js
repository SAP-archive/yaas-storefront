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

describe('AccountCtrl Test', function () {
    var $scope, $controller, $q, AccountCtrl, authModel, AccountSvc, mockBackend, mockedOrderListSvc, addresses, account, orders, translations, modalPromise;
    var storeTenant = '121212';
    var mockedGlobalData = {
        store: {tenant: storeTenant},
        setLanguage: jasmine.createSpy(),
        getLanguageCode: function(){ return null},
        getCurrency: function() { return null},
        addresses:  {
            meta: {
                total: 0
            }
        }

    };

    var mockedSettings = {
        accessCookie: 'accessCookie',
        userIdKey: 'userIdKey',
        apis: {
            customers: {
                baseUrl: 'http://dummy-test-server.hybris.com',
                apiKey: '123'
            },
            headers: {
                hybrisAuthorization: 'Authorization'
            }
        }
    };
    var mockedOrderList = [
        {
            'id': 'order123',
            'entries': [
                {
                    'amount': '1',
                    'sku': 'asdf1234'
                }
            ]
        }
    ];
    var mockedModal = {};
    var defaultLang = 'en';
    var mockedStoreConfig = {};
    var storeTenant = '121212';
    var address = {};
    mockedStoreConfig.defaultLanguage = defaultLang;
    mockedStoreConfig.storeTenant = storeTenant;
    var translateReturn = {
        then: jasmine.createSpy()
    };
    function mockedTranslate(title) {
        return translateReturn;
    }
    var updatePasswordDfd;
    var mockedAuthDialogManager = {
        showUpdatePassword: jasmine.createSpy('showUpdatePassword').andCallFake(function(){
            return updatePasswordDfd.promise;
        })
    };



    //***********************************************************************
    // Common Setup
    // - shared setup between constructor validation and method validation
    //***********************************************************************

    // configure the target controller's module for testing - see angular.mock
    beforeEach(angular.mock.module('ds.account'));
    beforeEach(angular.mock.module('restangular'));
    beforeEach(angular.mock.module('ui.router'));
    beforeEach(module('ds.account', function ($provide) {
        $provide.value('settings', mockedSettings);
        $provide.value('GlobalData', mockedGlobalData);
        $provide.value('$modal', mockedModal);
        $provide.value('$translate', mockedTranslate);
    }));

    beforeEach(inject(function(_AccountSvc_, _$httpBackend_, _$q_) {
        AccountSvc = _AccountSvc_;
        mockBackend = _$httpBackend_;
        $q = _$q_;
        addresses = $q.defer();
        account = $q.defer();
        orders = $q.defer();
        
        modalPromise = $q.defer();
        mockedModal.close = jasmine.createSpy('close');
        mockedModal.result = modalPromise.promise;
        // modalPromise.resolve({});
        mockedModal.open =  jasmine.createSpy('open').andReturn(mockedModal);
        updatePasswordDfd = $q.defer();
    }));

    beforeEach(inject(function(_$rootScope_, _$controller_, $q, _AccountSvc_, _$modal_) {

        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });

        $scope = _$rootScope_.$new();
        $controller = _$controller_;
        AccountSvc = _AccountSvc_;

        var deferredAddressSave = $q.defer();
        var deferredAddressGet = $q.defer();
        var deferredAddressRemove = $q.defer();
        deferredAddressSave.resolve({'id': 'address123'});
        deferredAddressGet.resolve([
            {'id': 'address123'},
            {'id': 'address456'}
        ]);
        deferredAddressRemove.resolve({});
        var deferredAccount = $q.defer();
        deferredAccount.resolve({'id': 'account123'});
        AccountSvc.saveAddress = jasmine.createSpy('saveAddress').andReturn(deferredAddressSave.promise);
        AccountSvc.getAddresses = jasmine.createSpy('getAddresses').andReturn(deferredAddressGet.promise);
        AccountSvc.removeAddress = jasmine.createSpy('removeAddress').andReturn(deferredAddressRemove.promise);
        AccountSvc.updateAccount = jasmine.createSpy('updateAccount').andReturn(deferredAccount.promise);

        var deferredOrderList = $q.defer();
        deferredOrderList.resolve(mockedOrderList);
        mockedOrderListSvc = {};
        mockedOrderListSvc.query = jasmine.createSpy('query').andReturn(deferredOrderList.promise);

        authModel = {
            email: 'some.user@hybris.com',
            password: 'secret'
        };
    }));

    
    describe("Controller tests", function() {

        beforeEach(function () {
            AccountCtrl = $controller('AccountCtrl', {$scope: $scope, 'AccountSvc': AccountSvc, addresses: addresses, account: account, orders: orders, OrderListSvc: mockedOrderListSvc, AuthDialogManager: mockedAuthDialogManager});
        });

        it("should expose correct scope inteface", function() {
            expect($scope.errors).toBeDefined();
            expect($scope.account).toBeDefined();
            expect($scope.addresses).toBeDefined();
            expect($scope.orders).toBeDefined();
            expect($scope.showAllButton).toBeDefined();
            expect($scope.currencies).toBeDefined();
            expect($scope.showCurrency).toBeDefined();
            expect($scope.languageLocales).toBeDefined();
            expect($scope.showLanguageLocale).toBeDefined();
            expect($scope.save).toBeDefined();
            expect($scope.openAddressModal).toBeDefined();
            expect($scope.closeAddressModal).toBeDefined();
            expect($scope.removeAddress).toBeDefined();
            
            expect($scope.refreshAddresses).toBeDefined();
            expect($scope.setAddressAsDefault).toBeDefined();
            expect($scope.showAllOrders).toBeDefined();
            expect($scope.updateAccount).toBeDefined();
            expect($scope.updatePassword).toBeDefined();
        });

        it("should save address if form is valid", function() {
            $scope.openAddressModal(address);
            $scope.save(address, false);
            $scope.$digest();
            expect(AccountSvc.saveAddress).not.toHaveBeenCalled();
            $scope.save(address, true);
            $scope.$digest();
            expect(AccountSvc.saveAddress).toHaveBeenCalled();
        });

        it("should open the modal dialog when calling opeAddressModal method", function() {
            $scope.openAddressModal(address);
            expect(mockedModal.open).toHaveBeenCalled();
        });

        it("should remove address by executing removeAddress with confirmation", function() {
            address.id = 'address123';
            spyOn(window, 'confirm').andReturn(true);
            $scope.removeAddress(address);
            $scope.$digest();
            expect(AccountSvc.removeAddress).toHaveBeenCalled();
        });

        it("should not remove address by executing removeAddress without confirmation", function() {
            spyOn(window, 'confirm').andReturn(false);
            $scope.removeAddress(address);
            $scope.$digest();
            expect(AccountSvc.removeAddress).not.toHaveBeenCalled();
        });

        it("should refresh addresss by executing refreshAddresses", function() {
            $scope.refreshAddresses();
            $scope.$digest();
            expect(AccountSvc.getAddresses).toHaveBeenCalled();
        });

        it("should set addresss as default by executing setAddressAsDefault", function() {
            var addr = { city: 'New York' };
            $scope.setAddressAsDefault(addr);
            $scope.$digest();
            expect(AccountSvc.saveAddress).toHaveBeenCalled();
            expect(addr.isDefault).toEqual(true);
        });

        it("should update account by executing updateAccount", function() {
            $scope.updateAccount();
            $scope.$digest();
            expect(AccountSvc.updateAccount).toHaveBeenCalled();
        });

        it("should partially update account when calling updateAccount with parameters", function() {
            $scope.updateAccount('contactEmail', 'notAnEmailAddress');
            $scope.$digest();
            expect(AccountSvc.updateAccount).wasNotCalled();
            expect(translateReturn.then).toHaveBeenCalled();
            $scope.updateAccount('preferredLanguage', 'en_US');
            $scope.$digest();
            expect(AccountSvc.updateAccount).toHaveBeenCalled();
            expect(mockedGlobalData.setLanguage).toHaveBeenCalled();
        });

        it("should show the currency as expected", function () {
            var retVal = $scope.showCurrency();
            expect(retVal).toEqualData('Not set');
            $scope.account.preferredCurrency = 'USD';
            retVal = $scope.showCurrency();
            expect(retVal).toEqualData('US - Dollar');
        });

        it("should show the language locale as expected", function () {
            var retVal = $scope.showLanguageLocale();
            expect(retVal).toEqualData('Not set');
            $scope.account.preferredLanguage = 'en_US';
            retVal = $scope.showLanguageLocale();
            expect(retVal).toEqualData('US - USA');
        });

        it("should show all of the orders", function () {
            $scope.showAllOrders();
            $scope.$digest();
            expect(mockedOrderListSvc.query).toHaveBeenCalled();
            expect($scope.showAllButton).toEqualData(false);
            expect($scope.orders).toEqualData(mockedOrderList);
        });

        it("should close address modal", function () {
            $scope.openAddressModal({'id': 'address123'});
            $scope.closeAddressModal();
            expect(mockedModal.close).toHaveBeenCalled();
        });

        it("should delegate call to AuthDialogManager's showUpdatePassword method", function() {
            $scope.updatePassword();
            expect(mockedAuthDialogManager.showUpdatePassword).toHaveBeenCalled();
        });

    });

});
