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

describe('EditUserNameDialogCtrl', function () {
    var $scope, $controller, $q,
        account, deferredAccount;

    var mockedGlobalData = {
        getUserTitles: jasmine.createSpy().andReturn(['', 'MR', 'MS', 'MRS', 'DR'])
    };

    var AccountSvc = {};
    var mockedModal = {};

    beforeEach(module('ds.account', function ($provide) {
        $provide.value('GlobalData', mockedGlobalData);
        $provide.value('$modalInstance', mockedModal);
    }));

    beforeEach(inject(function (_$rootScope_, _$controller_, _$q_) {
        $q = _$q_;
        account = {};

        mockedModal.close = jasmine.createSpy('close');
        mockedModal.dismiss = jasmine.createSpy('dismiss');

        $scope = _$rootScope_.$new();
        $controller = _$controller_;

        deferredAccount = $q.defer();
        AccountSvc.updateAccount = jasmine.createSpy('updateAccount').andReturn(deferredAccount.promise);
    }));

    describe('', function () {

        beforeEach(function () {
            $controller('EditUserNameDialogCtrl',
                {
                    $scope: $scope, 'AccountSvc': AccountSvc, 'account': account,
                    'GlobalData': mockedGlobalData, '$modalInstance': mockedModal
                });
        });

        it('should expose correct scope interface', function () {
            expect($scope.updateUserInfo).toBeDefined();
            expect($scope.closeEditUserDialog).toBeDefined();
        });

        it('should call AccountSvc.updateAccount() when updateUserInfo() is called and close modal when success', function () {
            $scope.modalInstance = mockedModal;
            $scope.updateUserInfo();

            expect(AccountSvc.updateAccount).toHaveBeenCalled();
            deferredAccount.resolve({});

            $scope.$digest();

            expect(mockedModal.close).toHaveBeenCalled();
        });

        it('should dismiss modal when $scope.closeEditUserDialog() is called', function () {
            $scope.closeEditUserDialog();
            expect(mockedModal.dismiss).toHaveBeenCalled();
        });

    });
});
