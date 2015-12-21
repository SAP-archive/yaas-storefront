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

describe('CustomerDetailsCtrl', function () {
    var $scope, $controller, $q, authModel, mockBackend,
        account, modalPromise, deferredAccount;
    
    var mockedGlobalData = {
        getCurrencySymbol: function () { return '$' },
        getEmailRegEx: function () { return (/^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i) },
        getUserTitles: jasmine.createSpy().andReturn(['', 'MR', 'MS', 'MRS', 'DR'])
    };

    var AccountSvc = {};
    var mockedModal = {};

    var updatePasswordDfd;
    var mockedAuthDialogManager = {
        showUpdatePassword: jasmine.createSpy('showUpdatePassword').andCallFake(function () {
            return updatePasswordDfd.promise;
        })
    };

    beforeEach(module('ds.account', function ($provide) {
        $provide.value('GlobalData', mockedGlobalData);
        $provide.value('$modal', mockedModal);
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

        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });

        $scope = _$rootScope_.$new();
        $controller = _$controller_;

        deferredAccount = $q.defer();
        deferredAccount.resolve({ 'id': 'account123' });
        AccountSvc.updateAccount = jasmine.createSpy('updateAccount').andReturn(deferredAccount.promise);

        authModel = {
            email: 'some.user@hybris.com',
            password: 'secret'
        };
    }));

    describe('', function () {

        beforeEach(function () {
            $controller('CustomerDetailsCtrl',
                {
                    $scope: $scope, 'AccountSvc': AccountSvc,
                    'AuthDialogManager': mockedAuthDialogManager, '$modal': mockedModal, 'GlobalData': mockedGlobalData
                });
        });

        it('should expose correct scope interface', function () {
            expect($scope.updateUserInfo).toBeDefined();
            expect($scope.updatePassword).toBeDefined();
        });

        it('should open modal when editAccountInfo() is called', function () {
            $scope.editAccountInfo('type1');

            expect($scope.mtype).toEqual('type1');
            expect(mockedModal.open).toHaveBeenCalled();
        });

        it('should close modal when closeEditUserDialog() is called', function () {
            $scope.modalInstance = mockedModal;
            $scope.closeEditUserDialog();

            expect(mockedModal.close).toHaveBeenCalled();
        });

        it('should call AccountSvc.updateAccount() when updateUserInfo() is called and close modal when success', function () {
            $scope.modalInstance = mockedModal;
            $scope.updateUserInfo();

            expect(AccountSvc.updateAccount).toHaveBeenCalled();
            deferredAccount.resolve({});

            $scope.$digest();

            expect(mockedModal.close).toHaveBeenCalled();
        });

        it('should delegate call to AuthDialogManager\'s showUpdatePassword method', function () {
            $scope.updatePassword();
            expect(mockedAuthDialogManager.showUpdatePassword).toHaveBeenCalled();
        });

        it('should update account by executing updateUserInfo', function () {
            $scope.updateUserInfo();
            expect(AccountSvc.updateAccount).toHaveBeenCalled();
        });

        it('should check if modal instance exists on $destroy', function () {
            $scope.$destroy();

            expect(mockedModal.close).not.toHaveBeenCalled();
        });

        it('should check if modal instance exists on $destroy and dismiss it if exists', function () {
            $scope.modalInstance = mockedModal;
            $scope.$destroy();

            expect(mockedModal.dismiss).toHaveBeenCalled();
        });
    });
});
