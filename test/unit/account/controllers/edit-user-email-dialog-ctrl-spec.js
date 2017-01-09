/*
 * [y] hybris Platform
 *
 * Copyright (c) 2000-2015 hybris AG
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of hybris
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with hybris.
 */

describe('EditUserEmailDialogCtrl', function () {
    var $scope, $controller, $q,
        account, deferredAccount;

    var AccountSvc = {};
    var mockedModal = {};

    beforeEach(module('ds.account', function ($provide) {
        $provide.value('$uibModalInstance', mockedModal);
    }));

    beforeEach(inject(function (_$rootScope_, _$controller_, _$q_) {
        $q = _$q_;
        account = {};

        mockedModal.close = jasmine.createSpy('close');
        mockedModal.dismiss = jasmine.createSpy('dismiss');

        $scope = _$rootScope_.$new();
        $controller = _$controller_;

        deferredAccount = $q.defer();
        AccountSvc.updateEmail = jasmine.createSpy('updateEmail').andReturn(deferredAccount.promise);
    }));

    describe('', function () {

        beforeEach(function () {
            $controller('EditUserEmailDialogCtrl',
                {
                    $scope: $scope, 'AccountSvc': AccountSvc, 'account': account,
                    '$uibModalInstance': mockedModal
                });
        });

        it('should expose correct scope interface', function () {
            expect($scope.updateUserInfo).toBeDefined();
            expect($scope.closeEditUserDialog).toBeDefined();
        });

        it('should call AccountSvc.updateAccount() when updateUserInfo() is called and change to step 2 when success', function () {

            $scope.step = 1;
            $scope.modalInstance = mockedModal;

            $scope.updateUserInfo();

            expect(AccountSvc.updateEmail).toHaveBeenCalled();
            deferredAccount.resolve({});

            $scope.$digest();

            expect($scope.step).toBe(2);
        });

        it('should call AccountSvc.updateAccount() when updateUserInfo() is called and show error message when failed with 401', function () {

            $scope.step = 1;
            $scope.modalInstance = mockedModal;

            //401

            $scope.updateUserInfo();

            expect(AccountSvc.updateEmail).toHaveBeenCalled();
            deferredAccount.reject({status: 401});

            $scope.$digest();

            expect($scope.error).toBe('EDIT_EMAIL_PASSWORD_NOT_CORRECT');
        });

        it('should call AccountSvc.updateAccount() when updateUserInfo() is called and show error message when failed with 409', function () {

            $scope.step = 1;
            $scope.modalInstance = mockedModal;

            //409

            $scope.updateUserInfo();

            expect(AccountSvc.updateEmail).toHaveBeenCalled();
            deferredAccount.reject({ status: 409 });

            $scope.$digest();

            expect($scope.error).toBe('EDIT_EMAIL_ALREADY_IN_USE');
        });

        it('should call AccountSvc.updateAccount() when updateUserInfo() is called and show error message when failed', function () {

            $scope.step = 1;
            $scope.modalInstance = mockedModal;

            //500

            $scope.updateUserInfo();

            expect(AccountSvc.updateEmail).toHaveBeenCalled();
            deferredAccount.reject({ status: 500 });

            $scope.$digest();

            expect($scope.error).toBe('EDIT_EMAIL_SOMETHING_WENT_WRONG');
        });

        it('should dismiss modal when $scope.confirm() is called', function () {
            $scope.confirm();
            expect(mockedModal.close).toHaveBeenCalled();
        });

        it('should dismiss modal when $scope.closeEditUserDialog() is called', function () {
            $scope.closeEditUserDialog();
            expect(mockedModal.dismiss).toHaveBeenCalled();
        });

    });
});
