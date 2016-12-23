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

describe('DeleteAccountBasicCtrl Test', function () {
    var $scope, $controller, deferredDeleteAccount;

    var mockedModalInstance = {
        dismiss: jasmine.createSpy('dismiss')
    };

    mockedSuccess = true;

    beforeEach(function(){
        module('ds.account');

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
        $controller('DeleteAccountBasicCtrl', {$scope: $scope, $uibModalInstance: mockedModalInstance, 
            success: mockedSuccess });
    }));

    describe('deleteAccount()', function () {
        it('should delegate to AccountSvc', function(){
            $scope.close();
            expect(mockedModalInstance.dismiss).toHaveBeenCalled();
        });
    });

});
