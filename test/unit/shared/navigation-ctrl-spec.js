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

describe('NavigationCtrl', function () {

    var $scope, $rootScope, $controller, $injector;
    var mockedGlobalData = {};

    var MockedAuthSvc = {};

    var mockedTranslate = {};
    var mockedStoreConfig = {};
    var mockedState = {};
    var defaultLang = 'en';
    mockedStoreConfig.defaultLanguage = defaultLang;
    var navCtrl, cart;
    cart = {};


    // configure the target controller's module for testing - see angular.mock
    beforeEach(module('ui.router'));
    beforeEach(angular.mock.module('ds.shared'));

    beforeEach(inject(function(_$rootScope_, _$controller_, _$injector_) {

        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });
        $rootScope =  _$rootScope_;
        $scope = _$rootScope_.$new();
        $controller = _$controller_;
        $injector = _$injector_;

        mockedGlobalData.languageCode = 'pl';
        mockedGlobalData.acceptLanguages = 'pl';
        mockedTranslate.use = jasmine.createSpy('use');
        mockedState.is = jasmine.createSpy('is').andReturn(true);
        mockedState.transitionTo = jasmine.createSpy('transitionTo');
    }));


    beforeEach(function () {
        navCtrl = $controller('NavigationCtrl', {$scope: $scope, $state: mockedState, cart: cart, GlobalData: mockedGlobalData,
        $translate: mockedTranslate, storeConfig: mockedStoreConfig, AuthSvc: MockedAuthSvc});
    });


    describe('toggleCart()', function () {
        it('should change showCart value', function(){
            $scope.toggleCart();
            expect($rootScope.showCart).toEqualData(true);
            $scope.toggleCart();
            expect($rootScope.showCart).toEqualData(false);
        });
    });

    describe('toggleOffCanvas()', function () {

        it('should toggle offCanvas', function () {
            $scope.toggleOffCanvas();
            expect($rootScope.showMobileNav).toEqualData(true);
            $scope.toggleOffCanvas();
            expect($rootScope.showMobileNav).toEqualData(false);
        });
    });

    describe('switchLanguage()', function(){

        it('should notify translate service', function(){
           var newLang = 'de';
           $scope.switchLanguage(newLang);
           expect(mockedTranslate.use).toHaveBeenCalledWith(newLang);
        });

        it('should update scope language', function(){
            var newLang = 'de';
            $scope.switchLanguage(newLang);
            expect($scope.languageCode).toEqualData(newLang);
        });

        it('should update global data current language', function(){
            var newLang = 'de';
            $scope.switchLanguage(newLang);
            expect(mockedGlobalData.languageCode).toEqualData(newLang);
        });

        it('to non-default language should update accept-languages', function(){
           var newLang = 'de';
            $scope.switchLanguage(newLang);
            expect(mockedGlobalData.acceptLanguages).toEqualData('de;q=1,en;q=0.5');
        });

        it('to default language should set accept-language to default', function(){
            var newLang =  defaultLang;
            $scope.switchLanguage(newLang);
            expect(mockedGlobalData.acceptLanguages).toEqualData(newLang);
        });

        it('should reload product state', function(){
            var newLang =  defaultLang;
            $scope.switchLanguage(newLang);
            expect(mockedState.transitionTo).toHaveBeenCalled();
        });
    });



});

