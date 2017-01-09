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
    var $scope, $controller, deferredChangePassword, deferredUpdatePassword, deferredShowDone, deferredLogin, mockedStateParams = {};

    var mockedAuthSvc = {

        updatePassword: jasmine.createSpy('updatePassword').andCallFake(function(){
            return deferredUpdatePassword.promise;
        })
    }

    var mockedTokenSvc = {
        getToken: jasmine.createSpy('getToken').andReturn({
            getUsername: jasmine.createSpy('getUsername')
        })
    };

    var mockedModalInstance = {
        close: jasmine.createSpy('changePassword')
    };

    var mockedState ={
        transitionTo: jasmine.createSpy('transitionTo')
    }

    var mockedAuthDialogManager = {
        showPasswordChanged: jasmine.createSpy('showPasswordChanged').andCallFake(function(){
            return deferredShowDone.promise
        }),
        open:  jasmine.createSpy('open').andCallFake(function(){
            return deferredLogin.promise
        })
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
        deferredUpdatePassword = _$q_.defer();
        deferredLogin = _$q_.defer();
        deferredShowDone = _$q_.defer();
        $controller('PasswordUpdateCtrl', {$scope: $scope,
            AuthSvc: mockedAuthSvc, AuthDialogManager: mockedAuthDialogManager, $state: mockedState, $stateParams: mockedStateParams, TokenSvc: mockedTokenSvc, $uibModalInstance: mockedModalInstance });
    }));

    describe('showAllErrors', function(){
       it('should set showPristineErrors to true', function(){
          $scope.showAllErrors();
           expect($scope.showPristineErrors).toBeTruthy();
       });
    });


    describe('updatePassword()', function(){
        it('should delegate to AuthSvc', function(){
           $scope.updatePassword();
            expect(mockedAuthSvc.updatePassword).toHaveBeenCalled();
        });

        it('should disable Submit', function(){
            $scope.updatePassword();
            expect($scope.submitDisabled).toBeTruthy();
        });

        describe('on success', function(){
            beforeEach(function(){
                $scope.updatePassword();
                deferredUpdatePassword.resolve({});
                $scope.$apply();
            });

            it('should close the modal dialog', function(){
                expect(mockedModalInstance.close).toHaveBeenCalled();
            });
        });

        describe('on failure', function(){

            describe("Wrong password", function() {
                beforeEach(function(){
                  $scope.updatePassword();
                  deferredUpdatePassword.reject({ status: 401 });
                  $scope.$apply();
                });

                it('should set error', function(){
                 expect($scope.errors.length > 0).toBeTruthy();
                 expect($scope.errors[0]).toEqual({ message: 'WRONG_CURRENT_PASSWORD' });
                });

                it('should re-enable submit', function(){
                  expect($scope.submitDisabled).toBeFalsy();
                });
            });
            
            describe("Server Error has occured", function() {
                var response = { data: { message: 'Error message' } };
                beforeEach(function(){
                  $scope.updatePassword();
                  deferredUpdatePassword.reject(response);
                  $scope.$apply();
                });

                it('should set error', function(){
                 expect($scope.errors.length > 0).toBeTruthy();
                 expect($scope.errors[0]).toEqual(response.data);
                });

                it('should re-enable submit', function(){
                  expect($scope.submitDisabled).toBeFalsy();
                });
            });
        });

    });

    describe('clearErrors()', function () {
        it('should set error message to empty', function () {
            $scope.errors = [{message:'something is wrong'}];

            $scope.clearErrors();
            expect($scope.errors).toEqualData([]);

        });
    });


});
