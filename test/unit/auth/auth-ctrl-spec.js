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

describe('AuthCtrl Test', function () {

    var $scope, $rootScope, $controller, AuthCtrl, authModel, AuthSvc, mockedSettings, mockedCookiesStorage;
    
    mockedSettings = {
        accessTokenKey: 'accessTokenKey',
        userIdKey: 'userIdKey',
        apis: {
            customers: {
                baseUrl: 'http://dummy-test-server.hybris.com',
                apiKey: '123'
            }
        }
    };
    var accessToken = 123;
    var getAccessTokenSpy = jasmine.createSpy('getAccessToken').andReturn(accessToken);
    mockedCookiesStorage = {
        setToken: jasmine.createSpy('setToken'),
        getToken: jasmine.createSpy('getToken').andReturn({
            getAccessToken: getAccessTokenSpy
        }),
        unsetToken: jasmine.createSpy('unsetToken')
    };

    //***********************************************************************
    // Common Setup
    // - shared setup between constructor validation and method validation
    //***********************************************************************

    // configure the target controller's module for testing - see angular.mock
    beforeEach(angular.mock.module('ds.auth'));
    beforeEach(angular.mock.module('restangular'));
    
    beforeEach(module('ds.auth', function($provide) {
        $provide.value('CookiesStorage', mockedCookiesStorage);
        $provide.value('settings', mockedSettings);
    }));

    beforeEach(inject(function(_AuthSvc_, _$httpBackend_) {
        AuthSvc = _AuthSvc_;
        mockBackend = _$httpBackend_;
    }));

    beforeEach(inject(function(_$rootScope_, _$controller_, $q, _AuthSvc_) {

        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });
        $rootScope =  _$rootScope_;
        $scope = _$rootScope_.$new();
        $controller = _$controller_;
        AuthSvc = _AuthSvc_;

        authModel = {
            email: 'some.user@hybris.com',
            password: 'secret'
        };
    }));


    describe("Delegating calls tests", function() {
        var stubbedCartSvc;

        beforeEach(function () {
            // stubbing a service
            stubbedAuthSvc = {
                signin: jasmine.createSpy().andReturn({
                    then: jasmine.createSpy()
                }),
                signup: jasmine.createSpy().andReturn({
                    then: jasmine.createSpy()
                })
            };

            AuthCtrl = $controller('AuthCtrl', {$scope: $scope, 'AuthSvc': stubbedAuthSvc});
        });

        it("should expose correct data to the scope", function() {
           expect($scope.user).toBeDefined();
           expect($scope.user.signup).toBeDefined();
           expect($scope.user.signin).toBeDefined();
           expect($scope.errors).toBeDefined();
           expect($scope.errors.signup).toBeDefined();
           expect($scope.errors.signin).toBeDefined();
           expect($scope.signup).toBeDefined();
           expect($scope.signin).toBeDefined();
        });

        it("should delegate to signup only if form is valid", function() {
            var mockedForm = {};

            mockedForm.$valid = true;
            $scope.signup(authModel, mockedForm);
            expect(stubbedAuthSvc.signup).wasCalledWith(authModel);

            stubbedAuthSvc.signup.reset();
            mockedForm.$valid = false;
            $scope.signup(authModel, mockedForm);
            expect(stubbedAuthSvc.signup).not.wasCalled();
        });

        it("should delegate to signin only if form is valid", function() {
            var mockedForm = {};

            mockedForm.$valid = true;
            $scope.signin(authModel, mockedForm);
            expect(stubbedAuthSvc.signin).wasCalledWith(authModel);

            stubbedAuthSvc.signin.reset();
            mockedForm.$valid = false;
            $scope.signin(authModel, mockedForm);
            expect(stubbedAuthSvc.signin).not.wasCalled();
        });

    });
    
    describe("Actual flow", function() {

        beforeEach(function () {
            AuthCtrl = $controller('AuthCtrl', {$scope: $scope, 'AuthSvc': AuthSvc});
        });

        it("should issue signin after successfull signup", function() {
            var mockedForm = {};
            var response = { accessToken: '12345' };

            mockedForm.$valid = true;
            mockBackend.expectPOST(mockedSettings.apis.customers.baseUrl + '/signup', authModel).respond({});
            mockBackend.expectPOST(mockedSettings.apis.customers.baseUrl + '/login?apiKey=' + mockedSettings.apis.customers.apiKey, authModel).respond(200, response);
            spyOn(AuthSvc, 'signup').andCallThrough();
            spyOn(AuthSvc, 'signin').andCallThrough();

            $scope.signup(authModel, mockedForm);
            mockBackend.flush();

            expect(AuthSvc.signup).wasCalled();
            expect(AuthSvc.signin).wasCalled();
        });

        it("should not have issued signin after unsuccessfull signup", function() {
            var mockedForm = {};
            var response = { status: 400, data: { details: 'Something serious is going on!'} };

            mockedForm.$valid = true;
            mockBackend.expectPOST(mockedSettings.apis.customers.baseUrl + '/signup', authModel).respond(response.status, response);
            spyOn(AuthSvc, 'signup').andCallThrough();
            spyOn(AuthSvc, 'signin').andCallThrough();
            
            $scope.signup(authModel, mockedForm);
            mockBackend.flush();

            expect(AuthSvc.signup).wasCalled();
            expect(AuthSvc.signin).not.wasCalled();
        });

    });

});
