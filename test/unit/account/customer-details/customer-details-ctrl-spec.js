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

describe('CustomerDetailsCtrl', function () {
    var $scope, $controller, $q, mockBackend,
        account, modalPromise, mockedAccountSvc;

    var mockedModal = {};

    var updatePasswordDfd;
    var mockedAuthDialogManager = {
        showUpdatePassword: jasmine.createSpy('showUpdatePassword').andCallFake(function () {
            return updatePasswordDfd.promise;
        }),
        showDeleteAccount: jasmine.createSpy('showDeleteAccount').andCallFake(function () {
            return deleteAccountDfd.promise;
        })
    };

    mockedAccountSvc = {
        isItSocialAccount: jasmine.createSpy('isItSocialAccount')
    };

    beforeEach(module('ds.account', function ($provide) {
        $provide.value('$uibModal', mockedModal);
    }));

    beforeEach(inject(function (_$rootScope_, _$controller_, _$httpBackend_, _$q_) {
        mockBackend = _$httpBackend_;
        $q = _$q_;
        account = $q.defer();
        modalPromise = $q.defer();
        mockedModal.close = jasmine.createSpy('close');
        mockedModal.dismiss = jasmine.createSpy('dismiss');
        mockedModal.result = modalPromise.promise;
        mockedModal.open = jasmine.createSpy('open').andReturn(mockedModal);
        mockedModal.opened = { then: function () { } };
        updatePasswordDfd = $q.defer();
        deleteAccountDfd = $q.defer();

        $scope = _$rootScope_.$new();
        $controller = _$controller_;
    }));

    describe('', function () {

        beforeEach(function () {
            $controller('CustomerDetailsCtrl',
                {
                    $scope: $scope, 'AuthDialogManager': mockedAuthDialogManager, '$uibModal': mockedModal, 'AccountSvc': mockedAccountSvc
                });
        });

        it('should expose correct scope interface', function () {
            expect($scope.editUserName).toBeDefined();
            expect($scope.editUserEmail).toBeDefined();
            expect($scope.updatePassword).toBeDefined();
            expect(mockedAccountSvc.isItSocialAccount).toBeDefined();
        });

        it('should open modal when editUserName() is called', function () {
            $scope.editUserName();

            expect(mockedModal.open).toHaveBeenCalled();

            modalPromise.resolve({ id: 1 });
            $scope.$digest();

            expect($scope.account.id).toBe(1);
        });

        it('should open modal when editUserEmail() is called', function () {
            $scope.editUserEmail();

            expect(mockedModal.open).toHaveBeenCalled();
        });

        it('should delegate call to AuthDialogManager\'s showUpdatePassword method', function () {
            $scope.updatePassword();
            expect(mockedAuthDialogManager.showUpdatePassword).toHaveBeenCalled();
        });

        it('should check if modal instance exists on $destroy', function () {
            $scope.modalInstance = null;
            $scope.$destroy();

            expect(mockedModal.close).not.toHaveBeenCalled();
        });

        it('should check if modal instance exists on $destroy and dismiss it if exists', function () {
            $scope.editUserName();
            $scope.$destroy();

            expect(mockedModal.dismiss).toHaveBeenCalled();
        });

        it('should call delete account from account svc upon deleteAccount method', function () {
            $scope.deleteAccount();
            expect(mockedAuthDialogManager.showDeleteAccount).toHaveBeenCalled();
        });
    });
});
