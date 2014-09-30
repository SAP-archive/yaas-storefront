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

    var AuthSvc, mockedTokenSvc, mockedSettings, mockBackend, mockedState, $q;
    var storeTenant = '121212';
    var mockedGlobalData = {store: {tenant: storeTenant}};
    var accessToken = 123;
    var username = 'some.user@hybris.com';
    var storeConfig = {
        storeTenant: storeTenant
    };
    var getAccessTokenSpy = jasmine.createSpy('getAccessToken').andReturn(accessToken);
    var getUsernameSpy = jasmine.createSpy('getUsernameSpy').andReturn(username);
    mockedTokenSvc = {
        setToken: jasmine.createSpy('setToken'),
        getToken: jasmine.createSpy('getToken').andReturn({
            getAccessToken: getAccessTokenSpy,
            getUsername: getUsernameSpy,
            getTenant: function(){
                return storeTenant;
            }
        }),
        unsetToken: jasmine.createSpy('unsetToken')
    };

    mockedState = {
        is: jasmine.createSpy('is').andReturn(true),
        go: jasmine.createSpy('go')
    };

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


    beforeEach(module('ds.auth', function($provide) {
        $provide.value('TokenSvc', mockedTokenSvc);
        $provide.value('settings', mockedSettings);
        $provide.value('GlobalData', mockedGlobalData);
        $provide.value('$state', mockedState);
        $provide.value('storeConfig', storeConfig);
    }));

    beforeEach(inject(function(_AuthSvc_, _$httpBackend_, _$q_) {
        AuthSvc = _AuthSvc_;
        mockBackend = _$httpBackend_;
        $q = _$q_;
    }));

    it('should expose correct interface', function () {
        expect(AuthSvc.signup).toBeDefined();
        expect(AuthSvc.signin).toBeDefined();
        expect(AuthSvc.signOut).toBeDefined();
        expect(AuthSvc.isAuthenticated).toBeDefined();
        expect(AuthSvc.customerSignin).toBeDefined();
    });


    it("should check if user is authenticated and delegate call to Storage", function() {
        var isAuth = AuthSvc.isAuthenticated();
        expect(mockedTokenSvc.getToken).wasCalled();
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
       
       mockBackend.expectPOST(mockedSettings.apis.customers.baseUrl+'/login', payload).respond(200, response);
       var promise = AuthSvc.signin(payload);
       promise.then(successSpy, errorSpy);

       mockBackend.flush();
       
       expect(promise.then).toBeDefined();
       expect(successSpy).wasCalled();
       expect(errorSpy).not.wasCalled();
       expect(mockedTokenSvc.setToken).wasCalledWith(response.accessToken, payload.email);
    });

    describe('signOut()', function(){
        var payload = {
                email: 'some@email.com',
                password: '123456'
            },
            response = {};


        it('should call logout', function(){
            mockBackend.expectGET(mockedSettings.apis.customers.baseUrl + '/logout?accessToken=' + accessToken).respond(200, response);
            AuthSvc.signOut(payload);
            mockBackend.flush();
            mockBackend.verifyNoOutstandingExpectation();
            mockBackend.verifyNoOutstandingRequest();
        });

        it('should unset token on logout success', function(){
            mockBackend.expectGET(mockedSettings.apis.customers.baseUrl + '/logout?accessToken=' + accessToken).respond(200, response);
            AuthSvc.signOut(payload);
            mockBackend.flush();
            expect(mockedTokenSvc.unsetToken).wasCalledWith(mockedSettings.accessCookie)
        });

        it('should unset token on logout failure', function(){
            mockBackend.expectGET(mockedSettings.apis.customers.baseUrl + '/logout?accessToken=' + accessToken).respond(500, response);
            AuthSvc.signOut(payload);
            mockBackend.flush();
            expect(mockedTokenSvc.unsetToken).wasCalledWith(mockedSettings.accessCookie)
        });

        it('should navigate to products if state is protected', function(){
            AuthSvc.signOut(payload);
            expect(mockedState.go).wasCalledWith('base.product');
        });
    });

    describe('requestPasswordReset()', function(){
        it('should issue POST on reset route', function(){
            var email = "foo@bar.com";
            mockBackend.expectPOST(mockedSettings.apis.customers.baseUrl + '/password/reset', {'email': email}).respond(200, {});
            AuthSvc.requestPasswordReset(email);
            mockBackend.flush();
        });
    });

    describe('changePassword()', function(){
        it('should issue POST on update route', function(){
            var token = "abc123";
            var newPw = "wordpass";
            mockBackend.expectPOST(mockedSettings.apis.customers.baseUrl + '/password/reset/update', {'token': token, 'password': newPw}).respond(200, {});
            AuthSvc.changePassword(token, newPw);
            mockBackend.flush();
        });
    });


});
