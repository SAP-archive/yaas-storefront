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

    var AuthSvc, mockedTokenSvc, siteConfig, mockBackend, mockedState, $q, customersUrl;
    var storeTenant = '121212';
    var YGoogleSignin = {
        logout: jasmine.createSpy().andReturn({
            then: jasmine.createSpy()
        })
    };
    var mockedGlobalData = {store: {tenant: storeTenant}, customerAccount: {accounts: [{providerId: 'google'}]}, user: {image: 'example.jpg'}};
    var accessToken = 123;
    var username = 'some.user@hybris.com';
    var appConfig = {
        storeTenant: function() { return storeTenant; },
        dynamicDomain: function() {return 'dynDomain'}
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

    mockedSessionSvc = {
        afterSocialLogin: jasmine.createSpy(),
        // afterLogIn: jasmine.createSpy().andReturn(deferredAfterLogin.promise),
        afterLogOut: jasmine.createSpy(),
        // afterLoginFromSignUp: jasmine.createSpy().andReturn(deferredAfterLoginFromSignUp.promise)
    };

    mockedState = {
        is: jasmine.createSpy('is').andReturn(true),
        go: jasmine.createSpy('go')
    };

    beforeEach(function() {
        module('restangular');
    });

    beforeEach(function() {
        module('ds.shared');
    });

    beforeEach(module('ds.auth', function($provide) {
        $provide.value('TokenSvc', mockedTokenSvc);
        $provide.value('GlobalData', mockedGlobalData);
        $provide.value('$state', mockedState);
        $provide.value('appConfig', appConfig);
        $provide.value('SessionSvc', mockedSessionSvc);
        $provide.value('YGoogleSignin', YGoogleSignin);
    }));

    beforeEach(inject(function(_AuthSvc_, _$httpBackend_, _$q_,SiteConfigSvc) {
        AuthSvc = _AuthSvc_;
        mockBackend = _$httpBackend_;
        siteConfig = SiteConfigSvc;
        customersUrl = siteConfig.apis.customers.baseUrl;
        $q = _$q_;
    }));


    it('should expose correct interface', function () {
        expect(AuthSvc.signup).toBeDefined();
        expect(AuthSvc.signin).toBeDefined();
        expect(AuthSvc.signOut).toBeDefined();
        expect(AuthSvc.isAuthenticated).toBeDefined();
        expect(AuthSvc.updatePassword).toBeDefined();
    });


    it("should check if user is authenticated and delegate call to Storage", function() {
        var isAuth = AuthSvc.isAuthenticated();
        expect(mockedTokenSvc.getToken).toHaveBeenCalled();
        expect(getAccessTokenSpy).toHaveBeenCalled();
        expect(getUsernameSpy).toHaveBeenCalled();
        expect(isAuth).toEqual(true);
    });

    it("should perform signin", function() {
        var deferredAfterLogin = $q.defer();
        mockedSessionSvc.afterLogIn = jasmine.createSpy().andReturn(deferredAfterLogin.promise);
        deferredAfterLogin.resolve({});
        var payload = {
            email: 'some@email.com',
            password: '123456'
        };
        var response = {
            accessToken: '12345'
        };
        var successSpy = jasmine.createSpy('success');
        var errorSpy = jasmine.createSpy('error');

        mockBackend.expectPOST(customersUrl +'/login', payload).respond(200, response);
        var promise = AuthSvc.signin(payload);
        promise.then(successSpy, errorSpy);

        mockBackend.flush();
       
        expect(promise.then).toBeDefined();
        expect(successSpy).toHaveBeenCalled();
        expect(errorSpy).not.toHaveBeenCalled();
        expect(mockedTokenSvc.setToken).toHaveBeenCalledWith(response.accessToken, payload.email);
        expect(mockedSessionSvc.afterLogIn).toHaveBeenCalled();
    });

    describe('signUp()', function(){
       it('should call signup and login, set token and invoke <<afterLoginFromSignUp>>', function(){
          var deferredAfterLoginFromSignUp = $q.defer();
          mockedSessionSvc.afterLoginFromSignUp = jasmine.createSpy().andReturn(deferredAfterLoginFromSignUp.promise);
          deferredAfterLoginFromSignUp.resolve({});
          var payload = {
              email: 'some@email.com',
              password: '123456'
          };
          var successSpy = jasmine.createSpy('success');
          var errorSpy = jasmine.createSpy('error');

          mockBackend.expectPOST(customersUrl + '/signup', payload).respond({});
          mockBackend.expectPOST(customersUrl +'/login', payload).respond(200, {});
          var promise = AuthSvc.signup(payload);
          promise.then(successSpy, errorSpy);

          mockBackend.flush();

          expect(promise.then).toBeDefined();
          expect(successSpy).toHaveBeenCalled();
          expect(errorSpy).not.toHaveBeenCalled();
          expect(mockedTokenSvc.setToken).toHaveBeenCalled();
          expect(mockedSessionSvc.afterLoginFromSignUp).toHaveBeenCalled();
       });
    });

    describe('signOut()', function(){
        var payload = {
                email: 'some@email.com',
                password: '123456'
            },
            response = {};


        it('should call logout', function(){
            mockBackend.expectGET(customersUrl + '/logout?accessToken=' + accessToken).respond(200, response);
            AuthSvc.signOut(payload);
            mockBackend.flush();
            mockBackend.verifyNoOutstandingExpectation();
            mockBackend.verifyNoOutstandingRequest();
        });

        it('should logout with google on signout if user is google logged in', function() {
            mockBackend.expectGET(customersUrl + '/logout?accessToken=' + accessToken).respond(200, response);
            AuthSvc.signOut(payload);
            mockBackend.flush();
            expect(YGoogleSignin.logout).toHaveBeenCalled();
        });

        it('should unset token on logout success', function(){
            mockBackend.expectGET(customersUrl + '/logout?accessToken=' + accessToken).respond(200, response);
            AuthSvc.signOut(payload);
            mockBackend.flush();
            expect(mockedTokenSvc.unsetToken).toHaveBeenCalledWith('auth.user')
        });

        it('should unset token on logout failure', function(){
            mockBackend.expectGET(customersUrl + '/logout?accessToken=' + accessToken).respond(500, response);
            AuthSvc.signOut(payload);
            mockBackend.flush();
            expect(mockedTokenSvc.unsetToken).toHaveBeenCalledWith('auth.user')
        });

        it('should invoke session service after logout', function(){
            AuthSvc.signOut(payload);
            expect(mockedSessionSvc.afterLogOut).toHaveBeenCalled;

        });
    });

    describe('requestPasswordReset()', function(){
        it('should issue POST on reset route', function(){
            var email = "foo@bar.com";
            mockBackend.expectPOST(customersUrl + '/password/reset', {'email': email}).respond(200, {});
            AuthSvc.requestPasswordReset(email);
            mockBackend.flush();
        });
    });

    describe('changePassword()', function(){
        it('should issue POST on update route', function(){
            var token = "abc123";
            var newPw = "wordpass";
            mockBackend.expectPOST(customersUrl + '/password/reset/update', {'token': token, 'password': newPw}).respond(200, {});
            AuthSvc.changePassword(token, newPw);
            mockBackend.flush();
        });
    });

    describe('updatePassword()', function(){
        it('should issue POST on password/change route', function(){
            var payload = {
                    currentPassword: 'currentPassword',
                    newPassword: 'newPassword',
                    email: 'test@hybristest.com'
                };
            mockBackend.expectPOST(customersUrl + '/password/change').respond(200, {});
            AuthSvc.updatePassword(payload.oldPassword, payload.newPassword, payload.email);
            mockBackend.flush();
        });
    });

    describe('socialLogin()', function(){
       it('should perform provider based login', function(){
           var providerId = 'facebook';
           var fbToken = 'abc';
           var hybrisToken = 'hyb';
           AuthSvc.socialLogin(providerId, fbToken);
           mockBackend.expectPOST(customersUrl + '/login/'+providerId).respond(201, {accessToken: hybrisToken});
           mockBackend.flush();
           expect(mockedTokenSvc.setToken).toHaveBeenCalledWith(hybrisToken, 'social');
           expect(mockedSessionSvc.afterLogIn).toHaveBeenCalled();
       });


    });

});
