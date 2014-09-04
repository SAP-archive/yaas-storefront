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

    var $scope, $rootScope, $controller, AuthModalDialogCtrl, $modalInstanceMock, $q, AuthSvc;
    var mockedSettings = {
        accessTokenKey: 'accessTokenKey',
        userIdKey: 'userIdKey',
        apis: {
            customers: {
                baseUrl: 'http://dummy-test-server.hybris.com',
                apiKey: '123'
            }
        }
    };

    //***********************************************************************
    // Common Setup
    // - shared setup between constructor validation and method validation
    //***********************************************************************

    // configure the target controller's module for testing - see angular.mock
    beforeEach(angular.mock.module('ds.auth'));

    beforeEach(inject(function(_$rootScope_, _$controller_, _$q_) {

        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });
        $rootScope =  _$rootScope_;
        $scope = _$rootScope_.$new();
        $controller = _$controller_;
        $q = _$q_;

        authModel = {
            email: 'some.user@hybris.com',
            password: 'secret'
        };
        $modalInstanceMock = {
            close: jasmine.createSpy('close')
        };
    }));


    describe("Delegating calls tests", function() {

        beforeEach(function () {
            MockedAuthSvc = {
                signin: jasmine.createSpy('signin').andReturn({
                    then: jasmine.createSpy('then')
                }),
                signup: jasmine.createSpy('signup').andReturn({
                    then: jasmine.createSpy('then')
                })
            };
            AuthModalDialogCtrl = $controller('AuthModalDialogCtrl', {$scope: $scope, $modalInstance: $modalInstanceMock, $controller: $controller, $q: $q, AuthSvc: MockedAuthSvc, settings: mockedSettings});
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
        });

        it("should delegate to AuthCtrl signup", function() {
            var mockedForm = {};
            mockedForm.$valid = true;
            $scope.signup(authModel, mockedForm);
            expect(MockedAuthSvc.signup).wasCalledWith(authModel);
        });

        it("should delegate to AuthCtrl signin", function() {
            var mockedForm = {};
            mockedForm.$valid = true;
            $scope.signin(authModel, mockedForm);
            expect(MockedAuthSvc.signin).wasCalledWith(authModel);
        });

    });

});
