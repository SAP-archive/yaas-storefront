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

describe('ySearch Test', function () {

    var $scope, $compile, $controller, $rootScope, $q, mockedSiteConfigSvc, deferredSearch, mockedState;
    var $httpBackend, deferredConfig, ysearchREST;
    var mockedYSearchService;
    var templateHtml = '<div></div>';
    var mockedGlobalData = {
        getCurrency: jasmine.createSpy().andReturn('USD'),
        getCurrencySymbol: jasmine.createSpy().andReturn('$')
    };
    var algoliaUrl = 'https://api.yaas.io/hybris/algolia-search/b1/';
    var searchResult = {
        query: 'text',
        nbHits: 2,
        hits: [{ id: 1, id: 2 }]
    };
    mockedSiteConfigSvc = {
        apis: {
            indexing: {
                baseUrl: 'https://api.yaas.io/hybris/algolia-search/b1/sitesettingsproj/'
            }
        }
    };
    mockedState = {
        go: jasmine.createSpy()
    };
    var configResponse = {
        "algoliaCredentials": {
            "applicationId": "appID",
            "searchKey": "searchKey",
            "indexName": "tenanatID"
        },
        "activation": true
    };

    beforeEach(module('ds.shared', function ($provide) {
        $provide.value('GlobalData', mockedGlobalData);
        $provide.value('SiteConfigSvc', mockedSiteConfigSvc);
        $provide.value('$state', mockedState);
    }));

    beforeEach(module('restangular'));

    // configure the target controller's module for testing - see angular.mock
    beforeEach(angular.mock.module('ds.ysearch'));


    beforeEach(inject(function ($injector) {
        $httpBackend = $injector.get('$httpBackend');
        $httpBackend.whenGET('js/app/shared/templates/ysearch.html').respond(200, templateHtml);
    }));

    beforeEach(inject(function (_$rootScope_, _$compile_, _$controller_, _$q_, ysearchREST, ysearchSvc, GlobalData) {
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();
        $compile = _$compile_;
        $controller = _$controller_('ysearchController', {
            $scope: $scope
        });
        $q = _$q_;
        mockedYSearchService = ysearchSvc;
        ysearchREST = ysearchREST;
        ysearchREST.AlgoliaSettings.setBaseUrl(algoliaUrl);

        deferredConfig = $q.defer();
        deferredSearch = $q.defer();
        mockedYSearchService.getResults = jasmine.createSpy('ysearchSvc.getResults').andReturn(deferredSearch.promise);
        mockedYSearchService.init = jasmine.createSpy('ysearchSvc.init').andReturn(deferredConfig.promise);
    }));

    function createYSearch() {
        var elem, compiledElem;
        elem = angular.element('<ysearch></ysearch>');
        compiledElem = $compile(elem)($scope);
        $scope.$digest();

        $httpBackend.flush();
        $controller = elem.controller;
        $scope = elem.isolateScope();

        return compiledElem;
    }

    describe('doSearch()', function () {

        beforeEach(function () {

        });

        it('should NOT do search when text is empty', function () {

            $scope.search.text = '';
            $scope.doSearch();
            expect(mockedYSearchService.getResults).not.toHaveBeenCalled();

            expect($scope.search.showSearchResults).toEqual(false);
            expect($scope.search.results).toEqual([]);
            expect($scope.search.numberOfHits).toEqual(0);
        });

        it('should do search when text is not empty', function () {

            $httpBackend.expectGET(algoliaUrl + 'sitesettingsproj/project/configuration').respond(configResponse);

            $scope.search.text = 'text';
            $scope.doSearch();
            expect(mockedYSearchService.getResults).toHaveBeenCalled();
            deferredSearch.resolve(searchResult);

            $scope.$digest();
        });
    });


    describe('showSearchResults()', function () {

        beforeEach(function () {
            $scope.doSearch = jasmine.createSpy('scope.doSearch');
        });

        it('should reload the currency as soon as showSearchResults is called', function () {
            $scope.showSearchResults();
            expect(mockedGlobalData.getCurrency).toHaveBeenCalled();
            expect(mockedGlobalData.getCurrencySymbol).toHaveBeenCalled();
            expect(mockedGlobalData.getCurrency.calls.length).toEqual(1);
            expect(mockedGlobalData.getCurrencySymbol.calls.length).toEqual(1);
            expect($scope.currency).toEqual('USD');
            expect($scope.currencySymbol).toEqual('$');

            // simulate a currency change
            mockedGlobalData.getCurrency.andReturn('EUR');
            mockedGlobalData.getCurrencySymbol.andReturn('€');

            // second call should update the currency
            $scope.showSearchResults();
            expect(mockedGlobalData.getCurrency.calls.length).toEqual(2);
            expect(mockedGlobalData.getCurrencySymbol.calls.length).toEqual(2);
            expect($scope.currency).toEqual('EUR');
            expect($scope.currencySymbol).toEqual('€');
        });

        it('should showSearchResults when search text is not empty and returned search results length === 0 and do search', function () {
            $scope.search.showSearchResults = false;
            $scope.search.text = 'text';
            $scope.search.results = [];

            expect($scope.search.showSearchResults).toEqual(false);
            $scope.showSearchResults();
            expect($scope.search.showSearchResults).toEqual(true);

            expect($scope.doSearch).toHaveBeenCalled();
        });

        it('shouldn\'t do search results if search text is empty', function () {
            $scope.search.showSearchResults = false;
            $scope.search.text = '';
            $scope.search.results = [{ id: '1' }, { id: '2' }];

            expect($scope.search.showSearchResults).toEqual(false);
            $scope.showSearchResults();
            expect($scope.search.showSearchResults).toEqual(true);

            expect($scope.doSearch).not.toHaveBeenCalled();
        });

        it('shouldn\'t do search results if search results array is not empty', function () {
            $scope.search.showSearchResults = false;
            $scope.search.text = 'text';
            $scope.search.results = [{ id: '1' }, { id: '2' }];

            expect($scope.search.showSearchResults).toEqual(false);
            $scope.showSearchResults();
            expect($scope.search.showSearchResults).toEqual(true);

            expect($scope.doSearch).not.toHaveBeenCalled();
        });
    });


    describe('hideSearchResults()', function () {

        beforeEach(function () {
            $rootScope.closeOffcanvas = jasmine.createSpy('rootScope.closeOffcanvas');
        });

        it('should hideSearchResults method is called', function () {
            $scope.search.showSearchResults = true;

            $scope.hideSearchResults();
            expect($rootScope.closeOffcanvas).toHaveBeenCalled();
            expect($scope.search.showSearchResults).toEqual(false);
        });
    });

});