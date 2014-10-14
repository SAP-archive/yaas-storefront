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

describe('PasswordResetUpdateCtrl Test', function () {
    var $scope, $controller, deferredChangePassword, deferredShowDone, deferredLogin, mockedStateParams = {};

    var mockedAuthSvc = {

        changePassword: jasmine.createSpy('changePassword').andCallFake(function(){
            return deferredChangePassword.promise;
        })
    }

    var mockedState ={
        transitionTo: jasmine.createSpy('transitionTo')
    }

    var mockedAuthDialogManager = {
        showPasswordChanged: jasmine.createSpy('showPasswordChanged').andCallFake(function(){
            return deferredShowDone.promise
        }),
        open:  jasmine.createSpy('open').andCallFake(function(){
            return deferredLogin.promise
        }),
        showResetPassword:  jasmine.createSpy()
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
        deferredLogin = _$q_.defer();
        deferredShowDone = _$q_.defer();
        $controller('ResetPasswordUpdateCtrl', {$scope: $scope,
            AuthSvc: mockedAuthSvc, AuthDialogManager: mockedAuthDialogManager, $state: mockedState, $stateParams: mockedStateParams });
    }));

    describe('initial state', function(){
       it('should initialize as expected', function(){
          expect($scope.showRetryLink).toBeFalsy();
       });
    });

    describe('showAllErrors', function(){
        it('should set showPristineErrors to true', function(){
            $scope.showAllErrors();
            expect($scope.showPristineErrors).toBeTruthy();
        });
    });

    describe('changePassword()', function(){
        it('should delegate to AuthSvc', function(){
            $scope.changePassword();
            expect(mockedAuthSvc.changePassword).toHaveBeenCalled();
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
                expect(mockedAuthDialogManager.showPasswordChanged).toHaveBeenCalled();
            });

            it('should redirect to sign-in and then main page', function(){
                deferredShowDone.reject({});
                $scope.$apply();
                expect(mockedAuthDialogManager.open).toHaveBeenCalled();
                deferredLogin.resolve({});
                $scope.$apply();
                expect(mockedState.transitionTo).toHaveBeenCalledWith('base.category', {  }, { reload : true, inherit : true, notify : true } );
            });
        });

        describe('on failure', function(){
            beforeEach(function(){
                $scope.changePassword();
                deferredChangePassword.reject({});
                $scope.$apply();
            });

            it('should set message', function(){
                expect($scope.error.message).toBeTruthy();
            });

            it('should re-enable submit', function(){
                expect($scope.submitDisabled).toBeFalsy();
            });

            it('should enable retry link', function(){
               expect($scope.showRetryLink).toBeTruthy();
            });

        });


    });

    describe('clearErrors()', function () {
        it('should set error message to empty', function () {
            $scope.error.message = 'something is wrong';
            $scope.error.details = 'details of what went wrong'
            $scope.clearErrors();
            expect($scope.error.message).toEqualData('');
            expect($scope.error.details).toEqualData('');

        });
    });

    describe('showRequestPasswordReset()', function(){
       it('should delegate to AuthDialogMgr', function(){
          $scope.showRequestPasswordReset();
           expect(mockedAuthDialogManager.showResetPassword).toHaveBeenCalled();
       });
    });


});