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

    var $scope, $compile, $rootScope, $q, mockedYSearchService, searchResults, mockedGlobalData;
    var $httpBackend;
    mockedYSearchService = {

    };
    mockedGlobalData = {
        search:{
            algoliaKey:'simpleKey',
            algoliaProject:'simpleProject'
        },
        store:{
            tenant:'simpleTenant'
        }
    };

    var templateHtml = '<div></div>';

    // configure the target controller's module for testing - see angular.mock
    beforeEach(angular.mock.module('ds.ysearch'));

    beforeEach(module('ds.shared', function ($provide) {
        $provide.value('GlobalData', mockedGlobalData);
    }));

    beforeEach(inject(function($injector) {
        $httpBackend = $injector.get('$httpBackend');
        $httpBackend.whenGET('js/app/shared/templates/ysearch.html').respond(200, templateHtml);
    }));

    beforeEach(inject(function(_$rootScope_, _$compile_, _$q_){
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();
        $compile = _$compile_;
        $q = _$q_;

        searchResults = {
            hits: [
                {'id': 'product1'},
                {'id': 'product2'}]
        };
        deferredSearchResults = $q.defer();
        deferredSearchResults.resolve(searchResults);

        mockedYSearchService.getResults = jasmine.createSpy('getResults').andReturn(deferredSearchResults.promise);

        mockedYSearchService.init = jasmine.createSpy('init').andReturn(true);

    }));

    function createYSearch() {
        var elem, compiledElem;
        elem = angular.element('<ysearch></ysearch>');
        compiledElem = $compile(elem)($scope);
        $scope.$digest();

        $httpBackend.flush();

        return compiledElem;
    }

    it('should init algolia when element created', function () {

        var el = createYSearch();
        $scope.$digest();

        expect(mockedYSearchService.init).toHaveBeenCalled();
    });


});