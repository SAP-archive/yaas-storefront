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

describe('DeleteAccountCtrl Test', function () {
    var $scope, $controller, deferredSignOut, deferredDeleteAccount, deferredState, mockedStateParams = {};

    var mockedAuthSvc = {
        signOut: jasmine.createSpy('signOut').andCallFake(function () {
            return deferredSignOut.promise;
        })
    };

    var mockedAccountSvc = {
        deleteAccount: jasmine.createSpy('deleteAccount').andCallFake(function () {
            return deferredDeleteAccount.promise;
        })
    };

    var mockedGlobalData = {
        user: {
            isAuthenticated: true
        }
    };

    var mockedState = {
        go: jasmine.createSpy('go').andCallFake(function () {
            return deferredState.promise;
        })
    }

    var mockedAuthDialogManager = {
        showDeleteAccountConfirmation: jasmine.createSpy('showDeleteAccountConfirmation')
    }

    beforeEach(function(){
        module('ds.account');

        module(function($provide){

            $provide.value('AuthSvc', mockedAuthSvc);
            $provide.value('AccountSvc', mockedAccountSvc);
        });
    });

    beforeEach(inject(function(_$rootScope_, _$controller_, _$q_) {
        $scope = _$rootScope_.$new();
        $controller = _$controller_;
        deferredSignOut = _$q_.defer();
        deferredDeleteAccount = _$q_.defer();
        deferredState = _$q_.defer();
        $controller('DeleteAccountCtrl', {$scope: $scope, AuthSvc: mockedAuthSvc, AccountSvc: mockedAccountSvc, 
            $stateParams: mockedStateParams, GlobalData: mockedGlobalData, $state: mockedState, AuthDialogManager: mockedAuthDialogManager});
    }));

    describe('initial state', function(){
        it('should delete account and sign out if customer is authenticated', function(){
            expect(mockedState.go).toHaveBeenCalled();
            deferredState.resolve({});
            $scope.$apply();
            expect(mockedAccountSvc.deleteAccount).toHaveBeenCalled();
            deferredDeleteAccount.resolve({});
            $scope.$apply();
            expect(mockedAuthSvc.signOut).toHaveBeenCalled();
            expect(mockedAuthDialogManager.showDeleteAccountConfirmation).toHaveBeenCalledWith(true);
        });
    });

});