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


describe('TopNavigationCtrl', function () {


    var $scope, $rootScope, $controller, $injector;
    var mockedGlobalData = {};
    var mockedState = {};
    var username = 'Joe';
    var mockedToken = {
        getUsername: function(){
            return username;
        }
    };
    var mockedAuthSvc = {
        signout: jasmine.createSpy('signout'),
        getToken: jasmine.createSpy('getToken').andReturn(mockedToken)
    };
    var AuthDialogManager = {
        isOpened: jasmine.createSpy('isOpened'),
        open: jasmine.createSpy('open'),
        close: jasmine.createSpy('close')
    };


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

    }));



    beforeEach(function () {
        navCtrl = $controller('TopNavigationCtrl', {$scope: $scope, $state: mockedState, cart: cart, GlobalData: mockedGlobalData, AuthSvc: mockedAuthSvc, AuthDialogManager:AuthDialogManager});
    });

    describe('initialization', function(){
       it('should bind cart and GlobalData', function(){
          expect($scope.GlobalData).toBeTruthy();
           expect($scope.cart).toBeTruthy();
       });
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

    describe('isShowCartButton()', function(){

        it('should not show for certain view states', function(){
            mockedState.is = jasmine.createSpy('is').andReturn(true);
            var result = $scope.isShowCartButton();
            expect(result).toBeFalsy();
        });

        it('should show for others', function(){
            mockedState.is = jasmine.createSpy('is').andReturn(false);
            var result = $scope.isShowCartButton();
            expect(result).toBeTruthy();
        });
    });



});

