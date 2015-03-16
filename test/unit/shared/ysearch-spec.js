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

    var $scope, $compile, $controller, $rootScope, $q;
    var $httpBackend;
    var mockedYSearchService = {};
    var templateHtml = '<div></div>';
    var mockedGlobalData = {};
    mockedGlobalData.store = {
        tenant: 'tenant'
    };
    mockedGlobalData.search = {
        algoliaKey: 'key'
    };

    // configure the target controller's module for testing - see angular.mock
    beforeEach(angular.mock.module('ds.ysearch'));

    beforeEach(module('ds.shared', function ($provide) {
        $provide.value('GlobalData', mockedGlobalData);
    }));

    beforeEach(inject(function ($injector) {
        $httpBackend = $injector.get('$httpBackend');
        $httpBackend.whenGET('js/app/shared/templates/ysearch.html').respond(200, templateHtml);
    }));

    beforeEach(inject(function (_$rootScope_, _$compile_, _$controller_) {
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();
        $compile = _$compile_;
        $controller = _$controller_('ysearchController', {
            $scope: $scope
        });

        mockedYSearchService.getResults = function () {

        };
        spyOn(mockedYSearchService, "getResults");

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

    it("should not call ySearchSvc.doSearch when there is no search term provided", function () {
        var el = createYSearch();
        $scope.$digest();

        $scope.search.text = '';
        $scope.doSearch();
        $scope.$digest();
        expect(mockedYSearchService.getResults).not.toHaveBeenCalled();
    });

    it("should show search results when there is search term", function () {
        $scope.search.text = 'text';
        $scope.doSearch();

        expect($scope.search.showSearchResults).toEqual(true);
    });

    it("shouldn't show search results when there is no search term", function () {
        $scope.search.text = '';
        $scope.doSearch();

        expect($scope.search.showSearchResults).toEqual(false);
    });

});