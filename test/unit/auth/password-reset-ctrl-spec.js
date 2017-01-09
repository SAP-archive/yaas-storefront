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
        showChangePassword: jasmine.createSpy('showChangePassword'),
        close: jasmine.createSpy()
    }

    beforeEach(function(){
        module('ds.auth');

        module(function($provide){
            $provide.value('$uibModalInstance', mockedModal);
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

        $controller('PasswordResetCtrl', {$scope: $scope,
            AuthSvc: mockedAuthSvc, AuthDialogManager: mockedAuthDialogManager, title: 'title', instructions: 'instruct' });
    }));

    describe('requestPasswordReset()', function(){
        it('should delegate to AuthSvc', function(){
            $scope.requestPasswordReset();
            expect(mockedAuthSvc.requestPasswordReset).toHaveBeenCalled();
        });

        it('on success, should close dialog and show check email', function(){
            $scope.requestPasswordReset();
            deferredPwReset.resolve({});
            $scope.$apply();
            expect(mockedAuthDialogManager.close).toHaveBeenCalled();
            expect(mockedAuthDialogManager.showCheckEmail).toHaveBeenCalled();
        });

        it('on failure, should close dialog', function(){
            $scope.requestPasswordReset();
            deferredPwReset.reject({message: 'failure'});
            $scope.$apply();
            expect($scope.message).toBeTruthy();
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
