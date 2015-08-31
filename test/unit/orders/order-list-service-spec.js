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

describe('OrderListSvc Test', function () {

    var orderUrl = 'http://order-service.dprod.cf.hybris.com';
    var orderRoute = '/orders';
    var $scope, $rootScope, $httpBackend, orderSvc, mockedAppConfig, mockedSettings, mockedCookiesStorage;

    mockedAppConfig = {};
    mockedAppConfig.defaultLanguage = 'en';
    mockedAppConfig.storeTenant = function(){ return '01010101'};
    mockedAppConfig.dynamicDomain = function(){ return 'dynDomain'};
    mockedAppConfig.clientId = function(){ return '1234ABC'};
    mockedAppConfig.redirectURI = function(){ return 'http://google.com'};

    var getAccessTokenSpy = jasmine.createSpy('getAccessToken').andReturn('123');

    mockedCookiesStorage = {
        setToken: jasmine.createSpy('setToken'),
        getToken: jasmine.createSpy('getToken').andReturn({
            getAccessToken: getAccessTokenSpy
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

    beforeEach(module('ds.auth', function($provide) {
        $provide.value('CookiesStorage', mockedCookiesStorage);
        $provide.value('settings', mockedSettings);
        $provide.value('appConfig', mockedAppConfig);
    }));

    var orderList = [
        {id: '1234'},
        {id: '5678'}
    ];

    beforeEach(module('restangular'));
    beforeEach(angular.mock.module('ds.orders', function () {}));


    beforeEach(function () {
        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });

        inject(function (_$httpBackend_, _$rootScope_, _OrderListSvc_, OrdersREST) {
            $rootScope = _$rootScope_;
            $scope = _$rootScope_.$new();

            $httpBackend = _$httpBackend_;
            OrdersREST.Orders.setBaseUrl(orderUrl);
            orderSvc = _OrderListSvc_;
        });
    });

    it('query returns order array', function () {
        $httpBackend.expectGET('http://order-service.dprod.cf.hybris.com/orders').respond(orderList);

        var orders = orderSvc.query();

        $httpBackend.flush();
        for (var i = 0; i < orders.length; i++) {
            expect(orders[i].id).toEqualData(orderList[i].id);
        };
    });

    it('query with success handler invokes callback on resolved promise', function () {
        var orders;
        $httpBackend.expectGET('http://order-service.dprod.cf.hybris.com/orders').respond(orderList);

        var myCallback = function(result) {
            orders = result;
        };

        orderSvc.query({}).then(myCallback);
        $httpBackend.flush();
        for (var i = 0; i < orders.length; i++) {
            expect(orders[i].id).toEqualData(orderList[i].id);
        };
    });
});
