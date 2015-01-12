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

describe('currencySelectorController Test', function () {

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
        getAvailableCurrencies: jasmine.createSpy('getAvailableCurrencies').andReturn([]),
        getCurrency: jasmine.createSpy('getCurrency').andReturn('originalValue'),
        getCurrencyById: jasmine.createSpy('getCurrencyById').andReturn('usd'),
        setCurrency: jasmine.createSpy('setCurrency')
    };

    beforeEach(function () {
        currencySelectorController = $controller('currencySelectorController', {$scope: $scope, $rootScope: $rootScope, 'GlobalData': mockedGlobalData});

    });

    describe('Currency Selection', function () {

        it('it should be able to update the selected currency', function () {
            $scope.currency = {selected: 'origValue'};
            $scope.updateCurrency('newVal');
            expect($scope.currency).toEqual({selected: 'newVal'})
        });

        it('should not change currency if values are the same', function(){
            $scope.currency.id = 0;
            $rootScope.$emit('currency:updated', {
                currencyId: 0,
                source: undefined
            });
            expect(mockedGlobalData.getCurrencyById).not.toHaveBeenCalled();
        });

        it('should change currency if values are the same', function(){
            $scope.currency.id = 1;
            $rootScope.$emit('currency:updated', {
                currencyId: 0,
                source: undefined
            });
            expect(mockedGlobalData.getCurrencyById).toHaveBeenCalled();
        });

    });

});
