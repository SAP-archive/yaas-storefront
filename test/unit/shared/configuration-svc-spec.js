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
    var $scope, $rootScope, $httpBackend, $q, configSvc, settings, configurationsUrl, siteConfig, fbGoogleDef, siteUrl,

        mockedGlobalData={store:{},
            setAvailableCurrencies: jasmine.createSpy(),
            setAvailableLanguages: jasmine.createSpy(),
            setDefaultLanguage: jasmine.createSpy(),
            setSite: jasmine.createSpy(),
            setSites: jasmine.createSpy()
        };
    var storeName = 'Default Store';
    var logoUrl = 'https://api.yaas.io/media-repository/v2/sitesettingsproj/wwayKT9jMgQYaJEs50YmwVPjBVrqbjAe/media/556c175ea70efaac32843463';
    var mockedStoreConfig = [{
        code: "europe123",
        name: "Default Store",
        active: true,
        "default": true,
        defaultLanguage: "en",
        languages: ["de", "en"],
        currency: "USD",
        homeBase: {
            address: {
                zipCode: "18000",
                country: "IT"
            }
        },
        payment: [{
            id: "stripe",
            name: "Stripe Payment Service",
            serviceType: "urn:x-yaas:service:payment",
            serviceUrl: "https://api.yaas.io/payment-stripe/v1",
            active: true,
            configuration: {
                "public": {
                    publicKey: "public"
                }
            }
        }],
        tax: [{
            id: "AVALARA",
            name: "Avalara Tax Service",
            serviceType: "urn:x-yaas:service:tax",
            serviceUrl: "http://avalara-b1.prod.cf.hybris.com/",
            active: true
        }],
        mixins: {
            storeLogoImageKey: {
                value: "https://api.yaas.io/media-repository/v2/sitesettingsproj/wwayKT9jMgQYaJEs50YmwVPjBVrqbjAe/media/556c175ea70efaac32843463"
            }
        }
    }];
    var mockedFBAndGoogleKeys = {
        facebookAppId: 'fbKey',
        googleClientId: 'googleKey'
    };
    var mockedAuthSvc={}, mockedAccountSvc={}, mockedCartSvc={}, mockedCategorySvc = {};
    var appConfig = {
        storeTenant: function() { return '121212/'; },
        dynamicDomain: function() {return 'dynDomain'}
    };

    beforeEach(function() {
        module('restangular');
    });

    beforeEach(module('ds.shared', function ($provide) {
        $provide.constant('storeConfig', mockedStoreConfig);
        $provide.constant('appConfig', appConfig);
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
        mockedGlobalData.getSite = jasmine.createSpy();
        mockedGlobalData.setSiteCookie = jasmine.createSpy();

        mockedCartSvc.refreshCartAfterLogin = jasmine.createSpy('refreshCartAfterLogin');
        mockedCartSvc.getCart = jasmine.createSpy('getCart');

        inject(function (_$httpBackend_, _$rootScope_, _ConfigSvc_, _$q_, SiteConfigSvc, _settings_) {
            $rootScope = _$rootScope_;
            $scope = _$rootScope_.$new();
            $httpBackend = _$httpBackend_;
            configSvc = _ConfigSvc_;
            siteConfig = SiteConfigSvc;

            configurationsUrl = siteConfig.apis.siteSettings.baseUrl + 'sites';
            siteUrl = siteConfig.apis.siteSettings.baseUrl + 'sites/europe123?expand=payment:active,tax:active,mixin:*';

            $q = _$q_;
            settings = _settings_;
        });
    });

    describe('initializeApp', function(){
        var promise;
        var catDef;

        beforeEach(function(){
            $httpBackend.expectGET(configurationsUrl).respond(200, mockedStoreConfig);

            $httpBackend.expectGET(siteUrl).respond(200, mockedStoreConfig[0]);

            catDef = $q.defer();
            mockedCategorySvc.getCategories = jasmine.createSpy('getCategories').andCallFake(function(){
                return catDef.promise;
            });

            fbGoogleDef = $q.defer();
            mockedAuthSvc.getFBAndGoogleLoginKeys = jasmine.createSpy().andReturn(fbGoogleDef.promise);
            fbGoogleDef.resolve(mockedFBAndGoogleKeys);
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
            var customerId = 'abc';
            accountDef.resolve({id: customerId});
            $httpBackend.flush();
            catDef.resolve({});
            $scope.$apply();
            expect(mockedAccountSvc.account).toHaveBeenCalled();
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
            expect(mockedCartSvc.getCart).toHaveBeenCalled;
            expect(successCallback).toHaveBeenCalled();
            expect(errorCallback).not.toHaveBeenCalled();
        });


    }) ;



});
