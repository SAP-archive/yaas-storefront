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
    var $scope, $controller, $q, AccountCtrl, authModel, mockBackend, mockedOrderListSvc,
        addresses, account, orders, modalPromise;
    var storeTenant = '121212';
    var eng = 'English';
    var usd = 'US Dollar';
    var mockedGlobalData = {
        store: {tenant: storeTenant},
        getCurrencyId: function() { return null},
        getAvailableLanguages: function(){return null},
        getEmailRegEx: function(){return (/^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i)},
        getCurrencySymbol: function () {return '$'},
        getAvailableCurrency: function() { return 'USD'},
        getCurrency: function() { return null},
        addresses:  {
            meta: {
                total: 0
            }
        },
        orders: {
            meta: {
                total: 0
            }
        },
        getUserTitles: jasmine.createSpy().andReturn(['', 'MR', 'MS', 'MRS', 'DR'])
    };

    var AccountSvc = { };

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
    var mockedAppConfig = {};
    var storeTenant = '121212';
    var address = {};
    mockedAppConfig.defaultLanguage = defaultLang;
    mockedAppConfig.storeTenant = storeTenant;
    var translateReturn = {
        then: jasmine.createSpy()
    };
    function mockedTranslate(title) {
        return { then: function(callback){callback(title)}};
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
        $provide.value('$uibModal', mockedModal);
    }));

    beforeEach(inject(function(_$rootScope_, _$controller_, _$httpBackend_, _$q_) {
        mockBackend = _$httpBackend_;
        $q = _$q_;
        addresses = $q.defer();
        account = $q.defer();
        orders = $q.defer();
        modalPromise = $q.defer();
        mockedModal.close = jasmine.createSpy('close');
        mockedModal.result = modalPromise.promise;
        mockedModal.open =  jasmine.createSpy('open').andReturn(mockedModal);
        mockedModal.opened = {then:function(){}};
        mockedModal.dismiss = jasmine.createSpy('dismiss');
        updatePasswordDfd = $q.defer();

        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });

        $scope = _$rootScope_.$new();
        $controller = _$controller_;

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
            AccountCtrl = $controller('AccountCtrl',
                {$scope: $scope, 'AccountSvc': AccountSvc, addresses: addresses, account: account, orders: orders,
                    OrderListSvc: mockedOrderListSvc, AuthDialogManager: mockedAuthDialogManager, $translate: mockedTranslate, GlobalData: mockedGlobalData});
        });

        it("should expose correct scope interface", function() {
            expect($scope.errors).toBeDefined();
            expect($scope.account).toBeDefined();
            expect($scope.addresses).toBeDefined();
            expect($scope.orders).toBeDefined();
            expect($scope.showAllOrdersButton).toBeDefined();
            expect($scope.showAddressButtons).toBeDefined();
            expect($scope.save).toBeDefined();
            expect($scope.openAddressModal).toBeDefined();
            expect($scope.closeAddressModal).toBeDefined();
            expect($scope.removeAddress).toBeDefined();
            
            expect($scope.refreshAddresses).toBeDefined();
            expect($scope.setAddressAsDefault).toBeDefined();
            expect($scope.showAllOrders).toBeDefined();
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

            $scope.removeAddress(address);
            expect(mockedModal.open).toHaveBeenCalled();

            modalPromise.resolve(true);

            $scope.$digest();
            expect(AccountSvc.removeAddress).toHaveBeenCalled();
        });

        it("should not remove address by executing removeAddress without confirmation", function() {
            $scope.removeAddress(address);
            expect(mockedModal.open).toHaveBeenCalled();
            
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

        it("should show all of the orders", function () {
            AccountCtrl.allOrdersLoaded = false;
            $scope.showAllOrders();
            $scope.$digest();
            expect(mockedOrderListSvc.query).toHaveBeenCalled();
            expect($scope.showAllOrdersButton).toEqualData(false);
            expect($scope.orders).toEqualData(mockedOrderList);
            expect(AccountCtrl.allOrdersLoaded).toBeTruthy();
        });

        it('should not request the order service if all orders are loaded', function() {
            AccountCtrl.allOrdersLoaded = true;
            $scope.showAllOrders();
            $scope.$apply();
            expect(mockedOrderListSvc.query).not.toHaveBeenCalled();
            expect(AccountCtrl.allOrdersLoaded).toBeTruthy();
        });

        it('should show all addresses', function() {
            $scope.showAllAddressButton = true;
            $scope.addresses = [{id:1}, {id:2}];
            $scope.showAllAddresses();
            $scope.$apply();
            expect($scope.showAddressFilter).toEqualData($scope.addresses.length);
            expect($scope.showAllAddressButton).toBeFalsy();
        });

        it('should show amount of addresses that is specified in default paramether', function() {
            $scope.showAllAddressButton = false;
            $scope.addresses = [{id:1}, {id:2}];
            $scope.showAllAddresses();
            $scope.$apply();
            expect($scope.showAddressFilter).toEqualData($scope.showAddressDefault);
            expect($scope.showAllAddressButton).toBeTruthy();
        });

        it("should close address modal", function () {
            $scope.openAddressModal({'id': 'address123'});
            $scope.closeAddressModal();
            expect(mockedModal.close).toHaveBeenCalled();
        });

        describe('saveOnEnter', function(){

            var formValid = true;

            it('should save if user selects ENTER', function(){
                var event = {keyCode:13, preventDefault: jasmine.createSpy()};
                var addr = {};
                var form = {};
                $scope.saveOnEnter(event, addr, formValid, form);
                expect(event.preventDefault).toHaveBeenCalled();
                expect(AccountSvc.saveAddress).toHaveBeenCalled();
            });

            it('should not save on other keys', function(){
                var event = {keyCode:11, preventDefault: jasmine.createSpy()};
                var addr = {};
                var form = {};
                $scope.saveOnEnter(event, addr, formValid, form);
                expect(event.preventDefault).not.toHaveBeenCalled();
                expect(AccountSvc.saveAddress).not.toHaveBeenCalled();
            });
        });

    });

});
