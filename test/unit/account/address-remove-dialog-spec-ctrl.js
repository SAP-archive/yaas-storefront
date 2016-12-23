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

describe('AddressRemoveDialogCtrl ', function () {

    var $scope, $rootScope, $controller;
    var mockedModalInstance, addressRemoveDialogCtrl;

    beforeEach(angular.mock.module('ds.account'));

    beforeEach(inject(function (_$rootScope_, _$controller_) {
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();
        $controller = _$controller_;

        mockedModalInstance = {
            dismiss: jasmine.createSpy(),
            close: jasmine.createSpy()
        };
    }));


    beforeEach(function () {
        addressRemoveDialogCtrl = $controller('AddressRemoveDialogCtrl',
            { $scope: $scope, '$uibModalInstance': mockedModalInstance });

    });

    describe('delete()', function () {
        it('should close modal and return true', function () {
            $scope.delete();

            expect(mockedModalInstance.close).toHaveBeenCalledWith(true);
        });

    });

    describe('close()', function () {
        it('should close modal and return \'cancel\'', function () {
            $scope.close();

            expect(mockedModalInstance.dismiss).toHaveBeenCalledWith('cancel');
        });
    });

});