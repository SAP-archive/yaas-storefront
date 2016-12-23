/*
 * [y] hybris Platform
 *
 * Copyright (c) 2000-2016 hybris AG
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of hybris
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with hybris.
 */

describe('DeleteAccountDialogCtrl Test', function () {
    var $scope, $controller, deferredDeleteAccount;

    var mockedAccountSvc = {
        deleteAccount: jasmine.createSpy('deleteAccount').andCallFake(function(){
            return deferredDeleteAccount.promise;
        })
    }

    var mockedModalInstance = {
        close: jasmine.createSpy(''),
        dismiss: jasmine.createSpy('')
    };

    var mockedAuthDialogManager = {
        showDeleteAccountConfirmRequest: jasmine.createSpy('showDeleteAccountConfirmRequest')
    };

    beforeEach(function(){
        module('ds.account');

        module(function($provide){

            $provide.value('AccountSvc', mockedAccountSvc);
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
        deferredDeleteAccount = _$q_.defer();
        $controller('DeleteAccountDialogCtrl', {$scope: $scope, AccountSvc: mockedAccountSvc, 
            $uibModalInstance: mockedModalInstance, AuthDialogManager: mockedAuthDialogManager });
    }));

    describe('deleteAccount()', function () {
        it('should delegate to AccountSvc', function(){
            $scope.deleteAccount();
            expect(mockedAccountSvc.deleteAccount).toHaveBeenCalled();
        });

        it('should disable Submit', function(){
            $scope.deleteAccount();
            expect($scope.submitDisabled).toBeTruthy();
        });

        describe('on success', function(){
            beforeEach(function(){
                $scope.deleteAccount();
                deferredDeleteAccount.resolve({});
                $scope.$apply();
            });

            it('should close the modal dialog', function(){
                expect(mockedModalInstance.close).toHaveBeenCalled();
                expect(mockedAuthDialogManager.showDeleteAccountConfirmRequest).toHaveBeenCalled();
            });
        });

        describe("on failure", function() {
            beforeEach(function(){
                $scope.deleteAccount();
                deferredDeleteAccount.reject();
                $scope.$apply();
            });

            it('should enable form and show error', function(){
                expect($scope.submitDisabled).toBeFalsy();
                expect($scope.showError).toBeTruthy();
            });
        });

        describe('close()', function () {
            it('should close modal instance on close function', function() {
                $scope.close();
                expect(mockedModalInstance.dismiss).toHaveBeenCalled();
            });
        });
    });

});
