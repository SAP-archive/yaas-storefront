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

describe('SidebarNavigationCtrl', function () {

    var $scope, $rootScope, $controller, $injector, $state, AuthDialogManager, mockedCategorySvc = {
        getCategories: jasmine.createSpy().andReturn({then: function(){}})
    };
    var mockedGlobalData = {
        setLanguage: jasmine.createSpy(),
        setCurrency: jasmine.createSpy()
    };
    var mockedAuthSvc = {};

    var mockedTranslate = {};


    var mockedState = {};
    var navCtrl, cart;
    cart = {};
    var username = 'Joe';
    var mockedToken = {
        getUsername: function(){
            return username;
        }
    };

    // configure the target controller's module for testing - see angular.mock
    beforeEach(module('ui.router'));
    beforeEach(angular.mock.module('ds.shared'));

    beforeEach(inject(function(_$rootScope_, _$controller_, _$injector_, _$state_) {

        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });
        $rootScope =  _$rootScope_;
        $scope = _$rootScope_.$new();
        $controller = _$controller_;
        $injector = _$injector_;
        $state = _$state_;
        AuthDialogManager = {
            isOpened: jasmine.createSpy('isOpened'),
            open: jasmine.createSpy('open'),
            close: jasmine.createSpy('close')
        };

        mockedGlobalData.languageCode = 'pl';
        mockedGlobalData.acceptLanguages = 'pl';
        mockedGlobalData.getCurrencySymbol = jasmine.createSpy('getCurrencySymbol').andReturn('USD');
        mockedTranslate.use = jasmine.createSpy('use');
        mockedState.is = jasmine.createSpy('is').andReturn(true);
        mockedState.go = jasmine.createSpy('go');
        mockedState.transitionTo = jasmine.createSpy('transitionTo');
        mockedAuthSvc.signOut = jasmine.createSpy('signOut').andReturn({
            then: jasmine.createSpy('then')
        });
        mockedAuthSvc.getToken = jasmine.createSpy('getToken').andReturn(mockedToken);
    }));

    beforeEach(function () {
        navCtrl = $controller('SidebarNavigationCtrl', {$scope: $scope, $state: mockedState, cart: cart, GlobalData: mockedGlobalData,
             AuthSvc: mockedAuthSvc,
            AuthDialogManager:AuthDialogManager, CategorySvc: mockedCategorySvc});
    });

    describe('onInitialization', function(){
        it('should retrieve categories', function(){
           expect(mockedCategorySvc.getCategories).wasCalled();
        });
    });

    describe('switchLanguage()', function(){

        it('should setLangauge in GlobalData', function(){
            var newLang = 'de';
            $scope.switchLanguage(newLang);
            expect(mockedGlobalData.setLanguage).toHaveBeenCalledWith(newLang);
        });

        it('should update scope language', function(){
            var newLang = 'de';
            $scope.switchLanguage(newLang);
            expect($scope.languageCode).toEqualData(newLang);
        });

        it('should reload product state', function(){
            var newLang =  'pl';
            $scope.switchLanguage(newLang);
            expect(mockedState.transitionTo).toHaveBeenCalled();
        });
    });


    describe('logout()', function(){
       it('should invoke signOut on AuthSvc', function(){
         $scope.logout();
           expect(mockedAuthSvc.signOut).toHaveBeenCalled();
       });
    });

    describe('hideMobileNav()', function(){
       it('should hide mobile nav', function(){
           $scope.hideMobileNav();
           expect($rootScope.showMobileNav).toBeFalsy();
       });
    });

    describe('myAccount()', function(){
       it('should hide mobile nav', function(){
          $scope.myAccount();
           expect($rootScope.showMobileNav).toBeFalsy();
       });
    });

    describe('switchCurrency()', function(){
        var cur = 'EU';
        beforeEach(function(){
            var cur = 'EU';
            $scope.switchCurrency(cur);
        });

        it('should set currency in GlobalData', function(){
            expect(mockedGlobalData.setCurrency).wasCalledWith(cur);
        });

        it('should reload current state', function(){
            expect(mockedState.transitionTo).toHaveBeenCalled();
        });
    });

    describe('login()', function(){
       it('should delegate to AuthDialogMgr', function(){
         $scope.login();
           expect(AuthDialogManager.open).wasCalled();
       });
    });

});

