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

    var $scope, $controller, $q, AuthCtrl, authModel, AuthSvc, mockBackend;
    var storeTenant = '121212';
    var mockedGlobalData = {store: {tenant: storeTenant}};
    var accessToken = 123;
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
    var defaultLang = 'en';
    var mockedStoreConfig = {};
    var storeTenant = '121212';
    mockedStoreConfig.defaultLanguage = defaultLang;
    mockedStoreConfig.storeTenant = storeTenant;

    //***********************************************************************
    // Common Setup
    // - shared setup between constructor validation and method validation
    //***********************************************************************

    // configure the target controller's module for testing - see angular.mock
    beforeEach(angular.mock.module('ds.auth'));
    beforeEach(angular.mock.module('restangular'));
    beforeEach(angular.mock.module('ui.router'));
    beforeEach(module('ds.auth', function ($provide) {
        $provide.value('settings', mockedSettings);
        $provide.value('GlobalData', mockedGlobalData);
    }));

    beforeEach(inject(function(_AuthSvc_, _$httpBackend_, _$q_) {
        AuthSvc = _AuthSvc_;
        mockBackend = _$httpBackend_;
        $q = _$q_;
    }));

    beforeEach(inject(function(_$rootScope_, _$controller_, $q, _AuthSvc_) {

        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });

        $scope = _$rootScope_.$new();
        $controller = _$controller_;
        AuthSvc = _AuthSvc_;

        authModel = {
            email: 'some.user@hybris.com',
            password: 'secret'
        };
    }));


    describe("Delegating calls tests", function() {

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

            AuthCtrl = $controller('AuthCtrl', {$scope: $scope, 'AuthSvc': stubbedAuthSvc, $q: $q});
        });



    });
    


});
