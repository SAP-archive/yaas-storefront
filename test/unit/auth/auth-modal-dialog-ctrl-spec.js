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

describe('AuthModalDialogCtrl Test', function () {
    var storeTenant = '121212';
    var mockedGlobalData = {store: {tenant: storeTenant}};
    var $scope, $rootScope, $controller, AuthModalDialogCtrl, $modalInstanceMock, $q, MockedAuthSvc, mockBackend, authModel;
    var mockedSettings = {
        accessCookie: 'accessCookie',
        userIdKey: 'userIdKey',
        apis: {
            customers: {
                baseUrl: 'http://dummy-test-server.hybris.com'
            }
        },
        headers: {
            hybrisAuthorization: 'Authorization'
        }
    };

    var mockedAuthDialogManager = {
        showResetPassword: jasmine.createSpy('showResetPassword')
    };

    authModel = {
        email: 'some.user@hybris.com',
        password: 'secret'
    };
    $modalInstanceMock = {
        close: jasmine.createSpy('close')
    };

    //***********************************************************************
    // Common Setup
    // - shared setup between constructor validation and method validation
    //***********************************************************************

    // configure the target controller's module for testing - see angular.mock
    beforeEach(angular.mock.module('restangular'));
    beforeEach(angular.mock.module('ui.router'));
    beforeEach(module('ds.auth', function ($provide) {
        $provide.value('settings', mockedSettings);
        $provide.value('GlobalData', mockedGlobalData);
    }));

    beforeEach(inject(function(_$rootScope_, _$controller_, _$q_, _$httpBackend_) {

        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });
        $rootScope =  _$rootScope_;
        $scope = _$rootScope_.$new();
        $controller = _$controller_;
        $q = _$q_;
        mockBackend = _$httpBackend_;

    }));

    beforeEach(function () {
        MockedAuthSvc = {
            signin: jasmine.createSpy('signin').andReturn({
                then: jasmine.createSpy('then')
            }),
            signup: jasmine.createSpy('signup').andReturn({
                then: jasmine.createSpy('then')
            })
        };
        AuthModalDialogCtrl = $controller('AuthModalDialogCtrl', {$scope: $scope, $modalInstance: $modalInstanceMock,
            $controller: $controller, $q: $q, AuthSvc: MockedAuthSvc, settings: mockedSettings, AuthDialogManager: mockedAuthDialogManager });
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
        expect($scope.continueAsGuest).toBeDefined();
        expect($scope.showResetPassword).toBeDefined();
    });

    describe('signin()', function(){
        it("should call AuthSvc signin if form valid", function() {
            var mockedForm = {};
            mockedForm.$valid = true;
            $scope.signin(authModel, mockedForm);
            expect(MockedAuthSvc.signin).wasCalledWith(authModel);
        });

        it('should not call AuthSvc if form invalid', function(){
            var mockedForm = {};
            mockedForm.$valid = false;
            $scope.signin(authModel, mockedForm);
            expect(MockedAuthSvc.signin).not.wasCalled();
        });
    });

    describe('signup', function(){

        it("should call AuthSvc signup if form valid", function() {
            var mockedForm = {};
            mockedForm.$valid = true;
            $scope.signup(authModel, mockedForm);
            expect(MockedAuthSvc.signup).wasCalledWith(authModel);
        });

        it('should not call AuthSvc if form invalid', function(){
            var mockedForm = {};
            mockedForm.$valid = false;
            $scope.signup(authModel, mockedForm);
            expect(MockedAuthSvc.signup).not.wasCalled();
        });

        it('should call signin after successful signup', function(){
            var mockedForm = {};
            mockedForm.$valid = true;
            $scope.signup(authModel, mockedForm);
            // NEED PROMISE
            //expect(MockedAuthSvc.signin).wasCalledWith(authModel);
        });
    });


    /*
    describe("Actual flow", function() {



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

    });*/

    describe('showResetPassword()', function(){
       it('should delegate to AuthDialogManager', function(){
          $scope.showResetPassword();
           expect(mockedAuthDialogManager.showResetPassword).wasCalled();
       });
    });

    describe('continueAsGuest()', function(){
       it('should close dialog', function(){
           $scope.continueAsGuest();
           expect($modalInstanceMock.close).wasCalled();
       });
    });

});
