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

describe('AuthSvc Test', function () {

    var AuthSvc, mockedCookiesStorage, mockedSettings, mockBackend;
    var defaultLang = 'en';
    var mockedStoreConfig = {};
    var storeTenant = '121212';
    mockedStoreConfig.defaultLanguage = defaultLang;
    mockedStoreConfig.storeTenant = storeTenant;
    var accessToken = 123;
    var username = 'some.user@hybris.com';
    var getAccessTokenSpy = jasmine.createSpy('getAccessToken').andReturn(accessToken);
    var getUsernameSpy = jasmine.createSpy('getUsernameSpy').andReturn(username);
    mockedCookiesStorage = {
        setToken: jasmine.createSpy('setToken'),
        getToken: jasmine.createSpy('getToken').andReturn({
            getAccessToken: getAccessTokenSpy,
            getUsername: getUsernameSpy
        }),
        unsetToken: jasmine.createSpy('unsetToken')
    };
    mockedSettings = {
        accessTokenKey: 'accessTokenKey',
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

    beforeEach(module('ds.auth', function($provide) {
        $provide.value('CookiesStorage', mockedCookiesStorage);
        $provide.value('settings', mockedSettings);
        $provide.value('storeConfig', mockedStoreConfig);
    }));

    beforeEach(inject(function(_AuthSvc_, _$httpBackend_) {
        AuthSvc = _AuthSvc_;
        mockBackend = _$httpBackend_;
    }));

    it('should expose correct interface', function () {
        expect(AuthSvc.signup).toBeDefined();
        expect(AuthSvc.signin).toBeDefined();
        expect(AuthSvc.signout).toBeDefined();
        expect(AuthSvc.setToken).toBeDefined();
        expect(AuthSvc.getToken).toBeDefined();
        expect(AuthSvc.isAuthenticated).toBeDefined();
        expect(AuthSvc.anonymousSignin).toBeDefined();
        expect(AuthSvc.customerSignin).toBeDefined();
    });

    it("should delegate setToken call to Storage", function() {
        AuthSvc.setToken();
        expect(mockedCookiesStorage.setToken).wasCalled();
    });

    it("should delegate getToken call to Storage", function() {
       AuthSvc.getToken();
       expect(mockedCookiesStorage.getToken).wasCalled(); 
    });

    it("should check if user is authenticated and delegate call to Storage", function() {
        var isAuth = AuthSvc.isAuthenticated();
        expect(mockedCookiesStorage.getToken).wasCalled();
        expect(getAccessTokenSpy).wasCalled();
        expect(getUsernameSpy).wasCalled();
        expect(isAuth).toEqual(true);
    });

    it("should perform signup", function() {
        var payload = {
                email: 'some@email.com',
                password: '123456'
            },
            successSpy = jasmine.createSpy('success'),
            errorSpy = jasmine.createSpy('error');
        
        mockBackend.expectPOST(mockedSettings.apis.customers.baseUrl + '/signup', payload).respond({});
        var promise = AuthSvc.signup(payload);
        promise.then(successSpy, errorSpy);

        mockBackend.flush();
        
        expect(promise.then).toBeDefined();
        expect(successSpy).wasCalled();
        expect(errorSpy).not.wasCalled();
    });

    it("should perform signin", function() {
       var payload = {
               email: 'some@email.com',
               password: '123456'
           },
           response = {
                accessToken: '12345'
           },
           successSpy = jasmine.createSpy('success'),
           errorSpy = jasmine.createSpy('error');
       
       mockBackend.expectPOST(mockedSettings.apis.customers.baseUrl + '/login?apiKey=' + mockedSettings.apis.customers.apiKey, payload).respond(200, response);
       var promise = AuthSvc.signin(payload);
       promise.then(successSpy, errorSpy);

       mockBackend.flush();
       
       expect(promise.then).toBeDefined();
       expect(successSpy).wasCalled();
       expect(errorSpy).not.wasCalled();
       expect(mockedCookiesStorage.setToken).wasCalledWith(response.accessToken, payload.email);
    });

    it("should perform signout", function() {
       var payload = {
               email: 'some@email.com',
               password: '123456'
           },
           response = {},
           successSpy = jasmine.createSpy('success'),
           errorSpy = jasmine.createSpy('error');
       spyOn(AuthSvc, 'signin').andCallThrough();
       spyOn(AuthSvc, 'anonymousSignin').andCallThrough();

       mockBackend.expectGET(mockedSettings.apis.customers.baseUrl + '/logout?accessToken=' + accessToken).respond(200, response);
       var accountsBaseUrl = 'http://yaas-test.apigee.net/test/account/v1/auth/anonymous/login'
       mockBackend.expectPOST(accountsBaseUrl + '?hybris-tenant=' + storeTenant).respond(200, response);
       var promise = AuthSvc.signout(payload);
       promise.then(successSpy, errorSpy);

       mockBackend.flush();
       
       expect(promise.then).toBeDefined();
       expect(successSpy).wasCalled();
       expect(errorSpy).not.wasCalled();
       expect(mockedCookiesStorage.unsetToken).wasCalledWith(mockedSettings.accessTokenKey);
       // expect signin was called afterwards for anonymousSignin
       expect(AuthSvc.signin).wasCalledWith();
       expect(AuthSvc.anonymousSignin).wasCalledWith();
    });

});
