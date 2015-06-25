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
        setLanguage: jasmine.createSpy('setLanguage'),
        setCurrency: jasmine.createSpy('setCurrency'),
        getLanguageCode: function(){ return null},
        getCurrencyId: function() { return null},
        getCurrencySymbol: function () {return '$'},
        getAvailableLanguages: function() { return [{id:'en', label:eng}]},
        getAvailableCurrency: function() { return 'USD'},
        getCurrency: function() { return null},
        addresses:  {
            meta: {
                total: 0
            }
        }
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
        $provide.value('$modal', mockedModal);
        $provide.value('$translate', mockedTranslate);
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
                    OrderListSvc: mockedOrderListSvc, AuthDialogManager: mockedAuthDialogManager, $translate: mockedTranslate});
        });

        it("should expose correct scope interface", function() {
            expect($scope.errors).toBeDefined();
            expect($scope.account).toBeDefined();
            expect($scope.addresses).toBeDefined();
            expect($scope.orders).toBeDefined();
            expect($scope.showAllOrdersButton).toBeDefined();
            expect($scope.currencies).toBeDefined();
            expect($scope.showAddressButtons).toBeDefined();
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

        it("should show the language locale as expected", function () {
            $scope.account.preferredLanguage = '';
            var retVal = $scope.showLanguageLocale();
            expect(retVal).toEqualData('NOT_SET');
            $scope.account.preferredLanguage = 'en';
            retVal = $scope.showLanguageLocale();
            expect(retVal).toEqualData(eng);
        });

        it("should show all of the orders", function () {
            $scope.showAllOrders();
            $scope.$digest();
            expect(mockedOrderListSvc.query).toHaveBeenCalled();
            expect($scope.showAllOrdersButton).toEqualData(false);
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


        describe('updateAccount()', function() {

            it('should update account by executing updateAccount', function () {
                $scope.updateAccount();
                $scope.$digest();
                expect(AccountSvc.updateAccount).toHaveBeenCalled();
            });

            it('update of preferred language should set language in GlobalData', function () {
                $scope.updateAccount('preferredLanguage', 'en');
                $scope.$digest();
                expect(AccountSvc.updateAccount).toHaveBeenCalled();
                expect(mockedGlobalData.setLanguage).toHaveBeenCalled();
            });

            it('update of preferred currency should set currency in GlobalData', function () {
                $scope.updateAccount('preferredCurrency', 'EUR');
                $scope.$digest();
                expect(AccountSvc.updateAccount).toHaveBeenCalled();
                expect(mockedGlobalData.setCurrency).toHaveBeenCalled();
            });

            it('should partially update account when calling updateAccount with parameters', function () {
                var msg = $scope.updateAccount('contactEmail', 'notAnEmailAddress');
                $scope.$digest();
                expect(AccountSvc.updateAccount).wasNotCalled();
                expect(msg).toBeTruthy();
            });
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
