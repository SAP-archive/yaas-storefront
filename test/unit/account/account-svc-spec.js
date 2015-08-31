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

describe('AccountSvc Test', function () {

    var AccountSvc, mockBackend, $q, $scope, customersUrl, siteConfig;
    var account = {"contactEmail":"test@hybristest.com","customerNumber":"C2191375191","firstName":"TestFn","id":"C2191375191","lastName":"TestLn","middleName":"TestMn","preferredCurrency":"EUR","preferredLanguage":"de_DE"};
    var addresses = [{"id":"541abacd07ce5813586182a5","contactName":"hybris UK Ltd.","street":"5th Floor, 2 Copthall Avenue","zipCode":"121212","city":"London","country":"USA","state":"TX","contactPhone":"+44 20 36088011","isDefault":true},{"id":"54083abe9d6eebfd91e20a6f","contactName":"Munich Offices","street":"Mailinger Str","streetNumber":"23","zipCode":"233212","city":"Munich","country":"USA","state":"IL","contactPhone":"+49 12 333 222","isDefault":false,"tags":[]},{"id":"54083adbdbee363ff47c3200","contactName":"Boulder Offices 1","street":"No name blvd","streetNumber":"12","zipCode":"2332232","city":"Boulder","country":"USA","state":"CO","contactPhone":"+1212 1221 1221","isDefault":false,"tags":[]}];
    var mockedGlobalData={
        customerAccount: null,
        user: {isAuthenticated: false},
        setCustomerAccount: function(acc){
            this.customerAccount = acc;
        },
        setAuthenticated: function(is){
            this.user.isAuthenticated = is;
        },
        addresses: {
            meta: {
                total: 6
            }
        }
    };

    beforeEach(function() {
        module('restangular');
        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });
    });

    beforeEach(function() {
        module('ds.shared', function ($provide) {
            $provide.constant('appConfig', {} );
        });
    });

    beforeEach(module('ds.account', function($provide) {
        $provide.value('GlobalData', mockedGlobalData);
    }));

    beforeEach(inject(function(_AccountSvc_, _$httpBackend_, _$q_, _$rootScope_, SiteConfigSvc) {
        AccountSvc = _AccountSvc_;
        siteConfig = SiteConfigSvc;
        customersUrl = siteConfig.apis.customers.baseUrl;
        mockBackend = _$httpBackend_;
        $scope = _$rootScope_.$new();
        $q = _$q_;
        mockedGlobalData.setAuthenticated(false);
        mockedGlobalData.setCustomerAccount(null);
    }));

    it('should expose correct interface', function () {
        expect(AccountSvc.account).toBeDefined();
        expect(AccountSvc.updateAccount).toBeDefined();
        expect(AccountSvc.getAddresses).toBeDefined();
        expect(AccountSvc.getAddress).toBeDefined();
        expect(AccountSvc.getDefaultAddress).toBeDefined();
        expect(AccountSvc.saveAddress).toBeDefined();
        expect(AccountSvc.removeAddress).toBeDefined();
        expect(AccountSvc.getCurrentAccount).toBeDefined();
    });

    describe('account()', function(){
        it("should retrieve account details and set account in GlobalData", function() {
            var successSpy = jasmine.createSpy('success'),
                errorSpy = jasmine.createSpy('error');

            mockBackend.expectGET(customersUrl + 'me').respond(account);
            var promise = AccountSvc.account();
            promise.then(successSpy, errorSpy);

            mockBackend.flush();

            expect(promise.then).toBeDefined();
            expect(successSpy).toHaveBeenCalled();
            expect(errorSpy).not.toHaveBeenCalled();
            expect(mockedGlobalData.customerAccount).toEqualData(account);
        });
    });


    it("should update account's details by calling updateAccount method", function() {
       var payload = angular.copy(account),
            successSpy = jasmine.createSpy('success'),
            errorSpy = jasmine.createSpy('error');
        
        payload.contactEmail = 'test-modified@test.com';
        mockBackend.expectPUT(customersUrl + 'me', payload).respond();
        var promise = AccountSvc.updateAccount(payload);
        promise.then(successSpy, errorSpy);

        mockBackend.flush();
        
        expect(promise.then).toBeDefined();
        expect(successSpy).toHaveBeenCalled();
        expect(errorSpy).not.toHaveBeenCalled();
    });

    it("should retrieve account's addresses by calling getAddresses method", function() {
        var successSpy = jasmine.createSpy('success'),
            errorSpy = jasmine.createSpy('error');
        
        mockBackend.expectGET(customersUrl + 'me/addresses').respond(addresses);
        var promise = AccountSvc.getAddresses();
        promise.then(successSpy, errorSpy);

        mockBackend.flush();
        
        expect(promise.then).toBeDefined();
        expect(successSpy).toHaveBeenCalled();
        expect(errorSpy).not.toHaveBeenCalled();
    });

    it("should retrieve account's address by calling getAddress method", function() {
        var successSpy = jasmine.createSpy('success'),
            errorSpy = jasmine.createSpy('error');
        
        mockBackend.expectGET(customersUrl + 'me/addresses/' + addresses[0].id).respond(addresses[0]);
        var promise = AccountSvc.getAddress(addresses[0].id);
        promise.then(successSpy, errorSpy);

        mockBackend.flush();
        
        expect(promise.then).toBeDefined();
        expect(successSpy).toHaveBeenCalled();
        expect(errorSpy).not.toHaveBeenCalled();
    });

    it("should retrieve account's default address by calling getDefaultAddress method", function() {
        var successSpy = jasmine.createSpy('success'),
            errorSpy = jasmine.createSpy('error');
        
        mockBackend.expectGET(customersUrl + 'me/addresses').respond(addresses);
        var promise = AccountSvc.getDefaultAddress();
        promise.then(successSpy, errorSpy);
        promise.then(function(addr) {
            expect(addr.isDefault).toEqual(true);
        });

        mockBackend.flush();
        
        expect(promise.then).toBeDefined();
        expect(successSpy).toHaveBeenCalled();
        expect(errorSpy).not.toHaveBeenCalled();
    });

    it("should save account's address by calling saveAddress method", function() {
       var payload = addresses[0],
            successSpy = jasmine.createSpy('success'),
            errorSpy = jasmine.createSpy('error');
        
        payload.contactName = 'Test addresss';
        mockBackend.expectPUT(customersUrl + 'me/addresses/' + payload.id, payload).respond();
        var promise = AccountSvc.saveAddress(payload);
        promise.then(successSpy, errorSpy);

        mockBackend.flush();
        
        expect(promise.then).toBeDefined();
        expect(successSpy).toHaveBeenCalled();
        expect(errorSpy).not.toHaveBeenCalled();
    });

    it("should remove account's address by calling removeAddress method", function() {
       var successSpy = jasmine.createSpy('success'),
            errorSpy = jasmine.createSpy('error');
        
        mockBackend.expectDELETE(customersUrl + 'me/addresses/' + addresses[0].id).respond();
        var promise = AccountSvc.removeAddress(addresses[0]);
        promise.then(successSpy, errorSpy);

        mockBackend.flush();
        
        expect(promise.then).toBeDefined();
        expect(successSpy).toHaveBeenCalled();
        expect(errorSpy).not.toHaveBeenCalled();
    });

    describe('getCurrentAccount()', function(){
        describe(' - not yet loaded - ', function(){

            it('should retrieve account data for authenticated user', function(){
                mockBackend.expectGET(customersUrl + 'me').respond(account);
                mockedGlobalData.setAuthenticated(true);
                var currentAccount;
                AccountSvc.getCurrentAccount().then(function(acc){
                    currentAccount = acc.plain();
                });
                mockBackend.flush();
                expect(currentAccount).toEqualData(account);
            });


        });

        describe(' - already exists - ', function(){

            var id = 'abc';

            beforeEach(function(){
                mockedGlobalData.setCustomerAccount({id: id});
            });

            it('should use account from GlobalData if available', function(){
                var curAccount = null;
                AccountSvc.getCurrentAccount().then(function(acc){
                    curAccount = acc;
                });

                $scope.$apply();
                expect(curAccount).toBeTruthy();
                expect(curAccount.id).toEqualData(id);
                mockBackend.verifyNoOutstandingRequest();
            });
        });
    });


});
