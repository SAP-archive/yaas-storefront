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

describe('ytracking', function () {

    var $q, $httpBackend, $scope, $compile, $rootScope, $timeout, mockedYtrackingSvc, mockedLocalStorage, mockedYtrackingDirective;
    var mockedSiteConfig = {
        apis: {
            tracking: {
                baseUrl: 'piwikUrl'
            }
        }
    };
    var mockedGlobalData = {
        piwik: {
            enabled: true
        }
    };
    var mockedLocalStorage = {};
    var openedCategory = {
        path: [{ name: 'cat1' }, { name: 'cat2' }]
    };
    var openedProduct = {
        id: 1,
        name: 'prod1',
        richCategory: openedCategory,
        defaultPrice: {
            value: 100
        }
    };

    function createYTracking() {
        var elem, compiledElem;
        elem = angular.element('<div ytracking></div>');
        compiledElem = $compile(elem)($scope);
        $scope.$digest();

        return compiledElem;
    }


    beforeEach(angular.mock.module('ds.ytacking', function ($provide) {
        $provide.value('GlobalData', mockedGlobalData);
        $provide.value('SiteConfigSvc', mockedSiteConfig);
        $provide.value('localStorage', mockedLocalStorage);
    }));

    beforeEach(inject(function (_$httpBackend_, _$q_, _$rootScope_, _$window_, _$compile_, _$timeout_) {
        $httpBackend = _$httpBackend_;
        $q = _$q_;
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        $window = _$window_;
        $compile = _$compile_;
        $timeout = _$timeout_;

        inject(function ($injector) {
            mockedYtrackingSvc = $injector.get('ytrackingSvc');
        });

        //Create element
        var element = createYTracking();
    }));

    describe('yTracking init', function () {

        it('should create $window._paq object when initialized', function () {
            expect($window._paq).toBeDefined();
        });

        it('should start using custom request processing for piwik', function () {
            var containsCustomProcessing = false;
            for (var i = 0; i < $window._paq.length; i++) {
                if ($window._paq[i][0] == 'setCustomRequestProcessing') {
                    containsCustomProcessing = true;
                }
            }
            expect(containsCustomProcessing).toBe(true);
        });
    });

    describe('yTracking events', function () {
        var setCategoryViewed;

        beforeEach(function () {

        });

        it('should call setCategoryViewed when user navigated to category page', function () {
            mockedYtrackingSvc.setCategoryViewed = jasmine.createSpy('setCategoryViewed');

            spyOn($scope, "$emit").andCallThrough();
            spyOn($rootScope, "$on").andCallThrough();

            $scope.$emit('categoryLoaded', openedCategory);
            //$rootScope.$apply();

            //run code to test
            expect($scope.$emit).toHaveBeenCalledWith("categoryLoaded", openedCategory);
            expect(mockedYtrackingSvc.setCategoryViewed).toHaveBeenCalled();
        });

        it('should add new items to _paq array when category loaded', function () {

            var lengthBefore = $window._paq.length;

            spyOn($scope, "$emit").andCallThrough();
            spyOn($rootScope, "$on").andCallThrough();
            spyOn(mockedYtrackingSvc, "setCategoryViewed").andCallThrough();

            $scope.$emit('categoryLoaded', openedCategory);

            $timeout.flush();

            var lengthAfter = $window._paq.length;
            expect(lengthAfter > lengthBefore).toBeTruthy();
        });


        it('should call setProductViewed when user navigated to product page', function () {

            mockedYtrackingSvc.setProductViewed = jasmine.createSpy('setProductViewed');

            spyOn($scope, "$emit").andCallThrough();
            spyOn($rootScope, "$on").andCallThrough();

            $scope.$emit('productLoaded', openedProduct);
            //$rootScope.$apply();

            //run code to test
            expect($scope.$emit).toHaveBeenCalledWith("productLoaded", openedProduct);
            expect(mockedYtrackingSvc.setProductViewed).toHaveBeenCalled();
        });

        it('should add new items to _paq array when product loaded', function () {

            var lengthBefore = $window._paq.length;

            spyOn($scope, "$emit").andCallThrough();
            spyOn($rootScope, "$on").andCallThrough();
            spyOn(mockedYtrackingSvc, "setProductViewed").andCallThrough();

            $scope.$emit('productLoaded', openedProduct);

            $timeout.flush();

            var lengthAfter = $window._paq.length;
            expect(lengthAfter > lengthBefore).toBeTruthy();
        });

    });

});