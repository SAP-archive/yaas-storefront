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

describe('languageSelectorController Test', function () {

    var $scope, $rootScope, $controller;

    //***********************************************************************
    // Common Setup
    // - shared setup between constructor validation and method validation
    //***********************************************************************

    // configure the target controller's module for testing - see angular.mock
    beforeEach(angular.mock.module('ds.shared'));

    beforeEach(inject(function(_$rootScope_,  _$controller_) {

        $rootScope =  _$rootScope_;
        $scope = _$rootScope_.$new();
        $controller = _$controller_;
    }));

    var cart, currencySelectorController, stubbedCartSvc, mockedGlobalData;

    mockedGlobalData = {
        getAvailableLanguages: jasmine.createSpy('getAvailableLanguages').andReturn([]),
        setLanguage: jasmine.createSpy('setLanguage').andReturn('newValue'),
        getLanguageCode: jasmine.createSpy('getLanguageCode').andReturn('usd'),
        setCurrency: jasmine.createSpy('setCurrency')
    };

    beforeEach(function () {
        currencySelectorController = $controller('languageSelectorController', {$scope: $scope, $rootScope: $rootScope, 'GlobalData': mockedGlobalData});

    });

    describe('language Selection', function () {

        it('it should be able to update the selected currency', function () {
            $scope.language = {selected: 'origValue'};
            $scope.updateLanguage('newVal');
            expect($scope.language.selected).toBe('newVal')
        });



    });

});
