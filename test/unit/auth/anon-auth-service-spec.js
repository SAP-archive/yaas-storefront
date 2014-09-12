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

describe('AnonAuthSvc', function () {

    var AnonAuthSvc, mockedTokenSvc, mockedSettings, mockBackend, $rootScope;
    var storeTenant = '121212';
    var mockedGlobalData = {store: {tenant: storeTenant}};
    var accessToken = 'abc123';
    var expiresIn = 700;
    var location =  'http://baas.test.cf.hybris.com/#scope=&expires_in=' + expiresIn + '&access_token=' + accessToken + '&user=ANONYMOUS&hybris-tenant=' + storeTenant;

    mockedTokenSvc = {
        setAnonymousToken: jasmine.createSpy('setAnonymousToken')
    };
    mockedSettings = {
        accessCookie: 'accessCookie',
        userIdKey: 'userIdKey',
        apis: {
            account: {
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
    }));

    beforeEach(inject(function(_AnonAuthSvc_, _$httpBackend_, _$rootScope_) {
        AnonAuthSvc = _AnonAuthSvc_;
        mockBackend = _$httpBackend_;
        $rootScope = _$rootScope_;
    }));

    it('should expose correct interface', function () {
        expect(AnonAuthSvc.getToken).toBeDefined();
    });

    describe('getToken()', function(){

        describe('happy path', function(){
            beforeEach(function(){
                mockBackend.expectPOST(mockedSettings.apis.account.baseUrl + '/auth/anonymous/login?hybris-tenant=' + storeTenant)
                    .respond(200, {}, {'Location': location});
            });

            afterEach(function(){
               mockBackend.resetExpectations();
            });

            it('should perform anonymous login if not yet in progress', function(){
                AnonAuthSvc.getToken();
                mockBackend.flush();
            });

            it('should not perform anonymous login if already in progress', function(){
                AnonAuthSvc.getToken();
                AnonAuthSvc.getToken();
                mockBackend.flush();
            });

            it('should save token', function(){
                AnonAuthSvc.getToken();
                mockBackend.flush();
                expect(mockedTokenSvc.setAnonymousToken).wasCalledWith(accessToken, expiresIn);
            });

            it('should re-enable new login attempt after token retrieval', function(){
                AnonAuthSvc.getToken();
                mockBackend.flush();
                mockBackend.resetExpectations();
                mockBackend.expectPOST(mockedSettings.apis.account.baseUrl + '/auth/anonymous/login?hybris-tenant=' + storeTenant).respond(200, {}, {'Location': location});
                AnonAuthSvc.getToken();
                mockBackend.flush();
            });

            it('should raise event', function(){
                spyOn($rootScope, "$emit")
                AnonAuthSvc.getToken();
                mockBackend.flush();
                expect($rootScope.$emit).toHaveBeenCalledWith('authtoken:obtained', accessToken);
            });
        });

        describe('failure path', function(){
            beforeEach(function(){
                mockBackend.expectPOST(mockedSettings.apis.account.baseUrl + '/auth/anonymous/login?hybris-tenant=' + storeTenant).respond(500, {});
            });

            it('should re-enable new login attempt on failure', function(){
                AnonAuthSvc.getToken();
                mockBackend.flush();
                mockBackend.resetExpectations();
                mockBackend.expectPOST(mockedSettings.apis.account.baseUrl + '/auth/anonymous/login?hybris-tenant=' + storeTenant).respond(200, {}, {'Location': location});
                AnonAuthSvc.getToken();
                mockBackend.flush();
            });
        });

    });



});
