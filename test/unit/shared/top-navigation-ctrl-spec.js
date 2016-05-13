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
    var mockedGlobalData = {
        customerAccount: {
            accounts: [{providerId: 'google'}]
        },
        user: {isAuthenticated: true, username: null, image: 'example.png'}
    };
    var $q;
    var mockedGoogle;
    var mockedUserImage;
    var deferredUser;
    var mockedState = {
        go: jasmine.createSpy('go')
    };
    var mockedCartSvc = {};
    var navCtrl, cart;
    cart = {};
    var username = 'Joe';
    var mockedToken = {
        getUsername: function(){
            return username;
        }
    };

    var user = {
        firstName: 'John', lastName: 'Doe', email: 'johndoe@test.com', image: null
    };

    var mockedAuthSvc = {
        signOut: jasmine.createSpy('signout'),
        getToken: jasmine.createSpy('getToken').andReturn(mockedToken),
        isGoogleLoggedIn: jasmine.createSpy('isGoogleLoggedIn').andReturn(true)
    };
    var mockAuthDialogManager = {
        isOpened: jasmine.createSpy('isOpened'),
        open: jasmine.createSpy('open'),
        close: jasmine.createSpy('close')
    };

    var mockedCartSvc = {
        getCart: jasmine.createSpy('getCart').andReturn(cart),
        getLocalCart: jasmine.createSpy('getLocalCart').andReturn(cart)
    };

    var mockedCategorySvc = {
        getCategoriesFromCache: jasmine.createSpy().andReturn({then: function(){}})
    };

    // configure the target controller's module for testing - see angular.mock
    beforeEach(module('ui.router'));
    beforeEach(module('ds.cart'));
    beforeEach(angular.mock.module('ds.shared'));

    beforeEach(inject(function(_$rootScope_, _$controller_, _$injector_, _$q_) {

        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });
        $rootScope =  _$rootScope_;
        $scope = _$rootScope_.$new();
        $controller = _$controller_;
        $injector = _$injector_;
        $q = _$q_;  
    }));

    beforeEach(function () {
        deferredUser = $q.defer();
        mockedGoogle = {
            loadData: function () {},
            getUser: jasmine.createSpy('getUser').andCallFake(function() {
                return deferredUser.promise;
            }),
            logout: function () {}
        };
        mockedUserImage = {firstName: 'John', lastName: 'Doe', email: 'johndoe@example.com', image: 'example.png'};
    });

    beforeEach(function () {
        $scope.user = {isAuthenticated: true, username: null, image: 'example.png'};
        navCtrl = $controller('TopNavigationCtrl', {$scope: $scope, $state: mockedState, CartSvc: mockedCartSvc,
            GlobalData: mockedGlobalData, AuthSvc: mockedAuthSvc, AuthDialogManager:mockAuthDialogManager,
            CategorySvc: mockedCategorySvc, YGoogleSignin: mockedGoogle, userImage: mockedUserImage});
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

    describe('auth functions', function () {
        it('should log out', function () {
            $scope.logout();

            expect(mockedAuthSvc.signOut).toHaveBeenCalled();
        });

        it('should log in', function () {
            $scope.login({}, {});

            expect(mockAuthDialogManager.open).toHaveBeenCalledWith({}, {});
        });
    });

    describe('state changes', function () {
        it('should go to my account', function () {
            $scope.myAccount();

            expect(mockedState.go).toHaveBeenCalled();
        });
    });
    
});

