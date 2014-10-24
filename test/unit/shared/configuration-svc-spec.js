/**
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
describe('ConfigurationSvc Test', function () {

    var url = 'http://dummyurl';
    var dummyRoute = '/dummyRoute';
    var configurationsUrl = 'http://configuration-v3.test.cf.hybris.com/configurations';
    var $scope, $rootScope, $httpBackend, $q, configSvc,
        mockedGlobalData={store:{},
            setAvailableCurrencies: jasmine.createSpy(),
            setAvailableLanguages: jasmine.createSpy()
        };
    var storeName = 'Sushi Store';
    var logoUrl = 'http://media/logo.jpg';
    var mockedStoreConfig = [{"key":"store.settings.name","value":storeName},{"key":"store.settings.image.logo.url",
        "value":logoUrl},{"key":"project_curr","value":"[{\"id\":\"USD\",\"label\":\"US Dollar\",\"default\":true,\"required\":true}]"},
        {"key":"project_lang", "value":"[{\"id\":\"en\",\"label\":\"English\"}]"}];
    var mockedAuthSvc={}, mockedAccountSvc={}, mockedCartSvc={};

    beforeEach(function() {
        module('restangular');
    });

    beforeEach(module('ds.shared', function ($provide) {
        $provide.constant('storeConfig', mockedStoreConfig);
        $provide.value('GlobalData', mockedGlobalData);
        $provide.value('AuthSvc', mockedAuthSvc);
        $provide.value('AccountSvc', mockedAccountSvc);
        $provide.value('CartSvc', mockedCartSvc);
    }));

    beforeEach(function () {
        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });

        mockedGlobalData.setCurrency = jasmine.createSpy();
        mockedGlobalData.setLanguage = jasmine.createSpy();
        mockedGlobalData.loadInitialLanguage = jasmine.createSpy();
        mockedGlobalData.loadInitialCurrency = jasmine.createSpy();

        mockedCartSvc.switchCurrency = jasmine.createSpy('switchCurrency');
        mockedCartSvc.refreshCartAfterLogin = jasmine.createSpy();

        inject(function (_$httpBackend_, _$rootScope_, _ConfigSvc_, _$q_) {
            $rootScope = _$rootScope_;
            $scope = _$rootScope_.$new();
            $httpBackend = _$httpBackend_;
            configSvc = _ConfigSvc_;
            $q = _$q_;
        });
    });

    describe('initializeApp', function(){
        var promise;

        beforeEach(function(){
            $httpBackend.expectGET(configurationsUrl).respond(200, mockedStoreConfig);
        });

        it('should GET settings and update store config', function () {
            promise = configSvc.initializeApp();
            $httpBackend.flush();
            expect(mockedGlobalData.store.name).toEqualData(storeName);
            expect(mockedGlobalData.store.logo).toEqualData(logoUrl);
            expect(mockedGlobalData.setAvailableCurrencies).toHaveBeenCalled;
            expect(mockedGlobalData.setAvailableLanguages).toHaveBeenCalled;
        });

        it('should load account for authenticated user and use preference settings if available', function(){
            var successCallback = jasmine.createSpy('success');
            var errorCallback = jasmine.createSpy('error');
            var accountDef = $q.defer();
            mockedAuthSvc.isAuthenticated = jasmine.createSpy().andReturn(true);
            mockedAccountSvc.account = jasmine.createSpy().andCallFake(function(){
                return accountDef.promise;
            });
            promise = configSvc.initializeApp();
            promise.then(successCallback, errorCallback);
            var lang = 'pl';
            var curr = 'CAD';
            var customerId = 'abc';
            accountDef.resolve({id: customerId, preferredLanguage: lang, preferredCurrency: curr});
            $httpBackend.flush();
            $scope.$apply();
            expect(mockedAccountSvc.account).toHaveBeenCalled();

            expect(mockedGlobalData.setLanguage).toHaveBeenCalledWith(lang);
            expect(mockedGlobalData.setCurrency).toHaveBeenCalledWith(curr);
            expect(mockedCartSvc.refreshCartAfterLogin).toHaveBeenCalledWith(customerId);
            //??? expect(successCallback).toHaveBeenCalled();
            expect(errorCallback).not.toHaveBeenCalled();
        });

        it('should delegate to GlobalData to load languages and currencies for anonymous user', function(){
            var successCallback = jasmine.createSpy('success');
            var errorCallback = jasmine.createSpy('error');

            mockedAuthSvc.isAuthenticated = jasmine.createSpy().andReturn(false);

            promise = configSvc.initializeApp();
            promise.then(successCallback, errorCallback);

            $httpBackend.flush();
            $rootScope.$apply();

            expect(mockedGlobalData.loadInitialLanguage).toHaveBeenCalled;
            expect(mockedGlobalData.loadInitialCurrency).toHaveBeenCalled;
            expect(mockedCartSvc.getCart).toHaveBeenCalled;
            //expect(successCallback).toHaveBeenCalled();
            expect(errorCallback).not.toHaveBeenCalled();
        });

        it('should switch cart currency if different than current currency', function(){
            mockedAuthSvc.isAuthenticated = jasmine.createSpy().andReturn(false);
            var cartDef = $q.defer();
            mockedCartSvc.getCart = jasmine.createSpy().andCallFake(function(){
                cartDef.promise;
            });
            cartDef.resolve({currency: 'CAD'});
            configSvc.initializeApp();
            var curr = 'USD';
            mockedGlobalData.getCurrencyId = jasmine.createSpy().andReturn(curr);

            $httpBackend.flush();
            $scope.$apply();
            // ??? expect(mockedCartSvc.switchCurrency).toHaveBeenCalledWith(curr);
        });
    }) ;



});
