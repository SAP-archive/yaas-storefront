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
    var $scope, $rootScope, $httpBackend, $q, configSvc, settings, configurationsUrl,siteConfig,

        mockedGlobalData={store:{},
            setAvailableCurrencies: jasmine.createSpy(),
            setAvailableLanguages: jasmine.createSpy()
        };
    var storeName = 'Sushi Store';
    var logoUrl = 'http://media/logo.jpg';
    var mockedStoreConfig = [{"key":"store.settings.name","value":storeName},{"key":"store.settings.image.logo.url",
        "value":logoUrl},{"key":"project_curr","value":"[{\"id\":\"USD\",\"label\":\"US Dollar\",\"default\":true,\"required\":true}]"},
        {"key":"project_lang", "value":"[{\"id\":\"en\",\"label\":\"English\"}]"}];
    var mockedAuthSvc={}, mockedAccountSvc={}, mockedCartSvc={}, mockedCategorySvc = {};

    beforeEach(function() {
        module('restangular');
    });

    beforeEach(module('ds.shared', function ($provide) {
        $provide.constant('storeConfig', mockedStoreConfig);
        $provide.value('GlobalData', mockedGlobalData);
        $provide.value('AuthSvc', mockedAuthSvc);
        $provide.value('AccountSvc', mockedAccountSvc);
        $provide.value('CartSvc', mockedCartSvc);
        $provide.value('CategorySvc', mockedCategorySvc);
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
        mockedCartSvc.refreshCartAfterLogin = jasmine.createSpy('refreshCartAfterLogin');
        mockedCartSvc.getCart = jasmine.createSpy('getCart');

        inject(function (_$httpBackend_, _$rootScope_, _ConfigSvc_, _$q_, SiteConfigSvc, _settings_) {
            $rootScope = _$rootScope_;
            $scope = _$rootScope_.$new();
            $httpBackend = _$httpBackend_;
            configSvc = _ConfigSvc_;
            siteConfig = SiteConfigSvc;
            configurationsUrl = siteConfig.apis.configuration.baseUrl + 'configurations';
            $q = _$q_;
            settings = _settings_;
        });
    });

    describe('initializeApp', function(){
        var promise;
        var catDef;

        beforeEach(function(){
            $httpBackend.expectGET(configurationsUrl).respond(200, mockedStoreConfig);
            catDef = $q.defer();
            mockedCategorySvc.getCategories = jasmine.createSpy('getCategories').andCallFake(function(){
                return catDef.promise;
            });
        });

        it('should GET settings and update store config', function () {
            mockedAuthSvc.isAuthenticated = jasmine.createSpy().andReturn(true);
            var accountDef = $q.defer();
            mockedAuthSvc.isAuthenticated = jasmine.createSpy().andReturn(true);
            mockedAccountSvc.account = jasmine.createSpy().andCallFake(function(){
                return accountDef.promise;
            });
            promise = configSvc.initializeApp();
            catDef.resolve({});
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
            catDef.resolve({});
            $scope.$apply();
            expect(mockedAccountSvc.account).toHaveBeenCalled();

            expect(mockedGlobalData.setLanguage).toHaveBeenCalledWith(lang, settings.eventSource.initialization);
            expect(mockedGlobalData.setCurrency).toHaveBeenCalledWith(curr, settings.eventSource.initialization);
            expect(mockedCartSvc.refreshCartAfterLogin).toHaveBeenCalledWith(customerId);
            expect(successCallback).toHaveBeenCalled();
            expect(errorCallback).not.toHaveBeenCalled();
        });

        it('should delegate to GlobalData to load languages and currencies for anonymous user', function(){
            var successCallback = jasmine.createSpy('success');
            var errorCallback = jasmine.createSpy('error');

            mockedAuthSvc.isAuthenticated = jasmine.createSpy().andReturn(false);

            promise = configSvc.initializeApp();
            promise.then(successCallback, errorCallback);

            $httpBackend.flush();
            catDef.resolve({});
            $rootScope.$apply();

            expect(mockedGlobalData.loadInitialLanguage).toHaveBeenCalled;
            expect(mockedGlobalData.loadInitialCurrency).toHaveBeenCalled;
            expect(mockedCartSvc.getCart).toHaveBeenCalled;
            expect(successCallback).toHaveBeenCalled();
            expect(errorCallback).not.toHaveBeenCalled();
        });


    }) ;



});
