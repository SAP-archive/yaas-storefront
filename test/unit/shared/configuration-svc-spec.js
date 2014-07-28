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
    var fullUrl = url+dummyRoute;
    var configurationsUrl = 'http://configuration-v2.test.cf.hybris.com/configurations';
    var $scope, $rootScope, $httpBackend, configSvc, globalData;
    var storeName = 'Sushi Store';
    var logoUrl = 'http://media/logo.jpg';
    var mockedStoreConfig = {"properties":[{"key":"store.settings.name","value":storeName},{"key":"store.settings.image.logo.url",
        "value":logoUrl}]};


    beforeEach(function() {
        module('restangular');
    });

    beforeEach(module('ds.shared', function ($provide) {
        $provide.value('storeConfig', mockedStoreConfig);
    }));

    beforeEach(function () {
        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });

        inject(function (_$httpBackend_, _$rootScope_, _ConfigSvc_, _GlobalData_) {
            $rootScope = _$rootScope_;
            $scope = _$rootScope_.$new();

            $httpBackend = _$httpBackend_;
            globalData = _GlobalData_;
            configSvc = _ConfigSvc_;
        });
    });

    describe('loadConfiguration', function(){
        it('should GET settings and update store config', function () {
            $httpBackend.expectGET(configurationsUrl).respond(mockedStoreConfig);

            configSvc.loadConfiguration();

            $httpBackend.flush();

            expect(globalData.store.name).toEqualData(storeName);
            expect(globalData.store.logo).toEqualData(logoUrl);
        });
    }) ;



});
