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

    var currencySelectorController, mockedGlobalData;

    var currency =  {id: 'USD', label: 'US Dollar'};
    var currencies = [currency];

    mockedGlobalData = {
        getAvailableCurrencies: jasmine.createSpy('getAvailableCurrencies').andReturn([]),
        getCurrency: function(){
            return currency;
        },
        getCurrencySymbol: function(){
            return '$';
        },
        getCurrencyById: function(currId){
            return {id: currId};
        },
        getAvailableCurrencies: function(){
            return currencies;
        },

        setCurrency: jasmine.createSpy('setCurrency')
    };

    beforeEach(function () {
        currencySelectorController = $controller('currencySelectorController', {$scope: $scope, $rootScope: $rootScope, 'GlobalData': mockedGlobalData});

    });

    describe('Currency Selection', function () {

        it('should have currency select box variables set correctly', function() {

            expect($scope.currencies).toBeDefined();
            expect($scope.currencies.length).toEqual(currencies.length);

            for (var i = 0; i < currencies.length; i++) {
                expect($scope.currencies[i]).toEqual(currencies[i]);
            };
        });

        describe('watchCurrency', function(){
            it('should setCurrency in GlobalData if selected currency changes', function(){
                var newCurr =  'EUR';
                $scope.currency.selected = {id: newCurr};
                $scope.$apply();

                //?? expect(mockedGlobalData.setCurrency).toHaveBeenCalledWith(newCurr);
            });
        });

        describe('onCurrencyChanged', function(){
            it('should update the selected currency if different', function(){
                $rootScope.$emit('currency:updated', {currencyId: 'EUR'});
                expect(mockedGlobalData.setCurrency).toHaveBeenCalled;
            });
        })


    });

});
