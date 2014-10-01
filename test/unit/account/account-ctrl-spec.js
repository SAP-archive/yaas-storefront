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

    var $scope, $controller, $q, AccountCtrl, authModel, AccountSvc, mockBackend, OrderListSvc, addresses, account, orders, modalPromise, mockedTranslate;
    var storeTenant = '121212';
    var mockedGlobalData = {store: {tenant: storeTenant}};
    var accessToken = 123;
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
    var mockedOrderList = {};
    var mockedModal = {};
    var defaultLang = 'en';
    var mockedStoreConfig = {};
    var storeTenant = '121212';
    var address = {};
    mockedStoreConfig.defaultLanguage = defaultLang;
    mockedStoreConfig.storeTenant = storeTenant;
    mockedTranslate = jasmine.createSpy('translate');

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
        $provide.value('OrderListSvc', mockedOrderList);
        $provide.value('$translate', mockedTranslate);
    }));

    beforeEach(inject(function(_AccountSvc_, _$httpBackend_, _$q_, _OrderListSvc_) {
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

        authModel = {
            email: 'some.user@hybris.com',
            password: 'secret'
        };
    }));

    
    describe("Controller tests", function() {

        beforeEach(function () {
            AccountCtrl = $controller('AccountCtrl', {$scope: $scope, 'AccountSvc': AccountSvc, addresses: addresses, account: account, orders: orders});
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
        });

        it("should save address if form is valid", function() {
            spyOn(AccountSvc, 'saveAddress').andCallThrough();
            $scope.save(address, false);
            expect(AccountSvc.saveAddress).not.wasCalled();
            $scope.save(address, true);
            expect(AccountSvc.saveAddress).wasCalled();
        });

        it("should open the modal dialog when calling opeAddressModal method", function() {
            $scope.openAddressModal(address);
            expect(mockedModal.open).wasCalled();
        });

        it("should remove address by executing removeAddress with confirmation", function() {
            address.id = 123;
            spyOn(AccountSvc, 'removeAddress').andCallThrough();
            var wcSpy = spyOn(window, 'confirm').andReturn(true);
            $scope.removeAddress(address);
            expect(AccountSvc.removeAddress).wasCalled();
        });

        it("should not remove address by executing removeAddress without confirmation", function() {
            spyOn(AccountSvc, 'removeAddress').andCallThrough();
            var wcSpy = spyOn(window, 'confirm').andReturn(false);
            $scope.removeAddress(address);
            expect(AccountSvc.removeAddress).not.wasCalled();
        });

        it("should refresh addresss by executing refreshAddresses", function() {
            spyOn(AccountSvc, 'getAddresses').andCallThrough();
            $scope.refreshAddresses();
            expect(AccountSvc.getAddresses).wasCalled();
        });

        it("should set addresss as default by executing setAddressAsDefault", function() {
            var addr = { city: 'New York' };
            spyOn(AccountSvc, 'saveAddress').andCallThrough();
            $scope.setAddressAsDefault(addr);
            expect(AccountSvc.saveAddress).wasCalled();
            expect(addr.isDefault).toEqual(true);
        });

        it("should update account by executing updateAccount", function() {
            spyOn(AccountSvc, 'updateAccount').andCallThrough();
            $scope.updateAccount();
            expect(AccountSvc.updateAccount).wasCalled();
        });

    });

});
