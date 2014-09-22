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

    var AccountSvc, mockedSettings, mockBackend, $q;
    var account = {"contactEmail":"test@test.com","customerNumber":"C2191375191","firstName":"TestFn","id":"C2191375191","lastName":"TestLn","middleName":"TestMn","preferredCurrency":"EUR","preferredLanguage":"de_DE"};
    var addresses = [{"id":"541abacd07ce5813586182a5","contactName":"hybris UK Ltd.","street":"5th Floor, 2 Copthall Avenue","zipCode":"121212","city":"London","country":"USA","state":"TX","contactPhone":"+44 20 36088011","isDefault":true},{"id":"54083abe9d6eebfd91e20a6f","contactName":"Munich Offices","street":"Mailinger Str","streetNumber":"23","zipCode":"233212","city":"Munich","country":"USA","state":"IL","contactPhone":"+49 12 333 222","isDefault":false,"tags":[]},{"id":"54083adbdbee363ff47c3200","contactName":"Boulder Offices 1","street":"No name blvd","streetNumber":"12","zipCode":"2332232","city":"Boulder","country":"USA","state":"CO","contactPhone":"+1212 1221 1221","isDefault":false,"tags":[]}];
    // var storeTenant = '121212';
    // var mockedGlobalData = {store: {tenant: storeTenant}};
    // var accessToken = 123;
    // var username = 'some.user@hybris.com';
    // var getAccessTokenSpy = jasmine.createSpy('getAccessToken').andReturn(accessToken);
    // var getUsernameSpy = jasmine.createSpy('getUsernameSpy').andReturn(username);
    
    // mockedTokenSvc = {
    //     setToken: jasmine.createSpy('setToken'),
    //     getToken: jasmine.createSpy('getToken').andReturn({
    //         getAccessToken: getAccessTokenSpy,
    //         getUsername: getUsernameSpy
    //     }),
    //     unsetToken: jasmine.createSpy('unsetToken')
    // };

    mockedSettings = {
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

    beforeEach(function() {
        module('restangular');
    });


    beforeEach(module('ds.account', function($provide) {
        $provide.value('settings', mockedSettings);
    }));

    beforeEach(inject(function(_AccountSvc_, _$httpBackend_, _$q_) {
        AccountSvc = _AccountSvc_;
        mockBackend = _$httpBackend_;
        $q = _$q_;
    }));

    it('should expose correct interface', function () {
        expect(AccountSvc.account).toBeDefined();
        expect(AccountSvc.updateAccount).toBeDefined();
        expect(AccountSvc.getAddresses).toBeDefined();
        expect(AccountSvc.getAddress).toBeDefined();
        expect(AccountSvc.getDefaultAddress).toBeDefined();
        expect(AccountSvc.saveAddress).toBeDefined();
        expect(AccountSvc.removeAddress).toBeDefined();
    });


    it("should retrieve account details by calling account method", function() {
        var successSpy = jasmine.createSpy('success'),
            errorSpy = jasmine.createSpy('error');
        
        mockBackend.expectGET(mockedSettings.apis.customers.baseUrl + '/me').respond(account);
        var promise = AccountSvc.account();
        promise.then(successSpy, errorSpy);

        mockBackend.flush();
        
        expect(promise.then).toBeDefined();
        expect(successSpy).wasCalled();
        expect(errorSpy).not.wasCalled();
    });

    it("should update account's details by calling updateAccount method", function() {
       var payload = angular.copy(account),
            successSpy = jasmine.createSpy('success'),
            errorSpy = jasmine.createSpy('error');
        
        payload.contactEmail = 'test-modified@test.com';
        mockBackend.expectPUT(mockedSettings.apis.customers.baseUrl + '/me', payload).respond();
        var promise = AccountSvc.updateAccount(payload);
        promise.then(successSpy, errorSpy);

        mockBackend.flush();
        
        expect(promise.then).toBeDefined();
        expect(successSpy).wasCalled();
        expect(errorSpy).not.wasCalled(); 
    });

    it("should retrieve account's addresses by calling getAddresses method", function() {
        var successSpy = jasmine.createSpy('success'),
            errorSpy = jasmine.createSpy('error');
        
        mockBackend.expectGET(mockedSettings.apis.customers.baseUrl + '/me/addresses').respond(addresses);
        var promise = AccountSvc.getAddresses();
        promise.then(successSpy, errorSpy);

        mockBackend.flush();
        
        expect(promise.then).toBeDefined();
        expect(successSpy).wasCalled();
        expect(errorSpy).not.wasCalled(); 
    });

    it("should retrieve account's address by calling getAddress method", function() {
        var successSpy = jasmine.createSpy('success'),
            errorSpy = jasmine.createSpy('error');
        
        mockBackend.expectGET(mockedSettings.apis.customers.baseUrl + '/me/addresses/' + addresses[0].id).respond(addresses[0]);
        var promise = AccountSvc.getAddress(addresses[0].id);
        promise.then(successSpy, errorSpy);

        mockBackend.flush();
        
        expect(promise.then).toBeDefined();
        expect(successSpy).wasCalled();
        expect(errorSpy).not.wasCalled(); 
    });

    it("should retrieve account's default address by calling getDefaultAddress method", function() {
        var successSpy = jasmine.createSpy('success'),
            errorSpy = jasmine.createSpy('error');
        
        mockBackend.expectGET(mockedSettings.apis.customers.baseUrl + '/me/addresses').respond(addresses);
        var promise = AccountSvc.getDefaultAddress();
        promise.then(successSpy, errorSpy);
        promise.then(function(addr) {
            expect(addr.isDefault).toEqual(true);
        });

        mockBackend.flush();
        
        expect(promise.then).toBeDefined();
        expect(successSpy).wasCalled();
        expect(errorSpy).not.wasCalled(); 
    });

    it("should save account's address by calling saveAddress method", function() {
       var payload = addresses[0],
            successSpy = jasmine.createSpy('success'),
            errorSpy = jasmine.createSpy('error');
        
        payload.contactName = 'Test addresss';
        mockBackend.expectPUT(mockedSettings.apis.customers.baseUrl + '/me/addresses/' + payload.id, payload).respond();
        var promise = AccountSvc.saveAddress(payload);
        promise.then(successSpy, errorSpy);

        mockBackend.flush();
        
        expect(promise.then).toBeDefined();
        expect(successSpy).wasCalled();
        expect(errorSpy).not.wasCalled(); 
    });

    it("should remove account's address by calling removeAddress method", function() {
       var successSpy = jasmine.createSpy('success'),
            errorSpy = jasmine.createSpy('error');
        
        mockBackend.expectDELETE(mockedSettings.apis.customers.baseUrl + '/me/addresses/' + addresses[0].id).respond();
        var promise = AccountSvc.removeAddress(addresses[0]);
        promise.then(successSpy, errorSpy);

        mockBackend.flush();
        
        expect(promise.then).toBeDefined();
        expect(successSpy).wasCalled();
        expect(errorSpy).not.wasCalled(); 
    });

});
