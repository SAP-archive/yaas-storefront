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

describe('PasswordUpdateCtrl Test', function () {
    var $scope, $controller, deferredChangePassword, mockedStateParams = {};

    var mockedAuthSvc = {

        changePassword: jasmine.createSpy('changePassword').andCallFake(function(){
            return deferredChangePassword.promise;
        })
    }

    var mockedState ={
        transitionTo: jasmine.createSpy('transitionTo')
    }

    var mockedAuthDialogManager = {
        showPasswordChanged: jasmine.createSpy('showPasswordChanged').andReturn({then: jasmine.createSpy('then')})
    }

    beforeEach(function(){
        module('ds.auth');

        module(function($provide){

            $provide.value('AuthSvc', mockedAuthSvc);
        });
    });

    beforeEach(inject(function(_$rootScope_, _$controller_, _$q_) {

        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });

        $scope = _$rootScope_.$new();
        $controller = _$controller_;
        deferredChangePassword = _$q_.defer();
        $controller('PasswordUpdateCtrl', {$scope: $scope,
            AuthSvc: mockedAuthSvc, AuthDialogManager: mockedAuthDialogManager, $state: mockedState, $stateParams: mockedStateParams });
    }));

    describe('showAllErrors', function(){
       it('should set showPristineErrors to true', function(){
          $scope.showAllErrors();
           expect($scope.showPristineErrors).toBeTruthy();
       });
    });
    describe('changePassword()', function(){
        it('should delegate to AuthSvc', function(){
           $scope.changePassword();
            expect(mockedAuthSvc.changePassword).wasCalled();
        });

        it('should disable Submit', function(){
            $scope.changePassword();
            expect($scope.submitDisabled).toBeTruthy();
        });

        describe('on success', function(){
            beforeEach(function(){
                $scope.changePassword();
                deferredChangePassword.resolve({});
                $scope.$apply();
            });

            it('should show <<password changed>>', function(){
                expect(mockedAuthDialogManager.showPasswordChanged).wasCalled();
            });
        });

        describe('on failure', function(){
            beforeEach(function(){
                $scope.changePassword();
                deferredChangePassword.reject({});
                $scope.$apply();
            });

            it('should set message', function(){
               expect($scope.message).toBeTruthy();
            });

            it('should re-enable submit', function(){
                expect($scope.submitDisabled).toBeFalsy();
            });

        });


    });


});
