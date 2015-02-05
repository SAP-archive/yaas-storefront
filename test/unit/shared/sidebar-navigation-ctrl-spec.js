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
        getCategoriesFromCache: jasmine.createSpy().andReturn({then: function(){}})
    };

    var mockedAuthSvc = {};

    var mockedState = {};
    var navCtrl, cart;
    cart = {};
    var username = 'Joe';
    var mockedToken = {
        getUsername: function(){
            return username;
        }
    };
    var mockedGlobalData;
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


        mockedState.is = jasmine.createSpy('is').andReturn(true);
        mockedState.go = jasmine.createSpy('go');
        mockedState.transitionTo = jasmine.createSpy('transitionTo');
        mockedAuthSvc.signOut = jasmine.createSpy('signOut').andReturn({
            then: jasmine.createSpy('then')
        });
        mockedAuthSvc.getToken = jasmine.createSpy('getToken').andReturn(mockedToken);
    }));

    beforeEach(function () {

        mockedGlobalData =  {};
        mockedGlobalData.store = {};

        navCtrl = $controller('SidebarNavigationCtrl', {$scope: $scope, $state: mockedState, cart: cart, GlobalData: mockedGlobalData,
             AuthSvc: mockedAuthSvc,
            AuthDialogManager:AuthDialogManager, CategorySvc: mockedCategorySvc});
    });

    describe('onInitialization', function(){
        it('should retrieve categories', function(){
           expect(mockedCategorySvc.getCategoriesFromCache).toHaveBeenCalled();
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

    describe('login()', function(){
       it('should delegate to AuthDialogMgr', function(){
         $scope.login();
           expect(AuthDialogManager.open).wasCalled();
       });
    });





});

