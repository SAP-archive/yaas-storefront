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

describe('PasswordResetCtrl Test', function () {
    var $scope, $controller, deferredPwReset, deferredChangePassword;
    var mockedModal = {
        close: jasmine.createSpy('close')
    };

    var mockedState = {
        transitionTo: jasmine.createSpy('transitionTo')
    };

    var mockedAuthSvc = {
        requestPasswordReset: jasmine.createSpy('requestPasswordReset').andCallFake(function(){
            return deferredPwReset.promise;
        }),
        changePassword: jasmine.createSpy('changePassword').andCallFake(function(){
            return deferredChangePassword.promise;
        })
    }

    var mockedAuthDialogManager = {
        showCheckEmail: jasmine.createSpy('showCheckEmail'),
        showPasswordChanged: jasmine.createSpy('showPasswordChanged'),
        showChangePassword: jasmine.createSpy('showChangePassword')
    }

    beforeEach(function(){
        module('ds.auth');

        module(function($provide){
            $provide.value('$modalInstance', mockedModal);
            $provide.value('AuthSvc', mockedAuthSvc);
            $provide.value('$state', mockedState);
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
        deferredPwReset = _$q_.defer();

        $controller('PasswordResetCtrl', {$scope: $scope, $modalInstance: mockedModal,
            AuthSvc: mockedAuthSvc, AuthDialogManager: mockedAuthDialogManager });
    }));

    describe('requestPasswordReset()', function(){
        it('should delegate to AuthSvc', function(){
            $scope.requestPasswordReset();
            expect(mockedAuthSvc.requestPasswordReset).wasCalled();
        });

        it('on success, should close dialog and show check email', function(){
            $scope.requestPasswordReset();
            deferredPwReset.resolve({});
            $scope.$apply();
            expect(mockedModal.close).wasCalled();
            expect(mockedAuthDialogManager.showCheckEmail).wasCalled();
        });

        it('on failure, should close dialog', function(){
            $scope.requestPasswordReset();
            deferredPwReset.reject({});
            $scope.$apply();
            expect(mockedModal.close).wasCalled();
        });
    });

    describe('showChangePassword()', function(){
        it('should close current modal', function(){
            $scope.showChangePassword();
            expect(mockedModal.close).wasCalled();
        });

        it('should transition to <<change password>> state', function(){
            $scope.showChangePassword();
            expect(mockedState.transitionTo).wasCalledWith('base.changePassword');
        });
    });

    describe('clearErrors()', function(){
       it('should remove error message', function(){
            $scope.message = 'something';
            $scope.clearErrors();
           expect($scope.message).toEqualData('');
       });
    });


});
