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

describe('AuthDialogManager', function () {

    var AuthDialogManager, dialogPromise, $q, $location;
    var mockedSettings = {};
    var mockedModal = {};
    var mockedDialog = {};

    beforeEach(function(){
        module('ds.auth');

        module(function($provide){
            $provide.value('$uibModal', mockedModal);
            $provide.value('settings', mockedSettings);
        });

        inject(function(_$q_, _$location_, _AuthDialogManager_) {
            $q = _$q_;
            $location = _$location_;
            AuthDialogManager = _AuthDialogManager_;
        });

        dialogPromise = $q.defer();

        mockedDialog.close = jasmine.createSpy('close');
        mockedDialog.result = dialogPromise.promise;
        dialogPromise.resolve({});
        mockedModal.open =  jasmine.createSpy('open').andReturn(mockedDialog);
    });


    describe('initialization', function(){
        it('should expose correct interface', function () {
            expect(AuthDialogManager.open).toBeDefined();
            expect(AuthDialogManager.close).toBeDefined();
            expect(AuthDialogManager.showUpdatePassword).toBeDefined();
            expect(AuthDialogManager.showResetPassword).toBeDefined();
            expect(AuthDialogManager.showPasswordChanged).toBeDefined();
            expect(AuthDialogManager.showCheckEmail).toBeDefined();
            expect(AuthDialogManager.showDeleteAccount).toBeDefined();
            expect(AuthDialogManager.showDeleteAccountConfirmRequest).toBeDefined();
            expect(AuthDialogManager.showDeleteAccountConfirmation).toBeDefined();
        });
    });

    describe('open()', function(){

        var options = {
            templateUrl: 'abc.html',
            controller: 'SomeCtrl',
            resolve: {
                loginOpts: {targetState: 'target'}
            }
        };

        it('should open the dialog by delegating call to $uibModal instance with options', function() {
            AuthDialogManager.open(options);
            expect(mockedModal.open).toHaveBeenCalledWith(options);

            mockedModal.open.reset();
            var expectedOptions = angular.copy(options);
            expectedOptions.keyboard = false;
            expectedOptions.backdrop = 'static';

            AuthDialogManager.open(expectedOptions, {required: true});

            expect(mockedModal.open).toHaveBeenCalledWith(expectedOptions);
        });

        it('should return promise for dialog closure', function(){
            var onSuccess = jasmine.createSpy('success');
            var onFailure = jasmine.createSpy('failure');
            var resultPromise = AuthDialogManager.open(options);
            resultPromise.then(onSuccess, onFailure);
            expect(resultPromise).toBeTruthy();
            expect(resultPromise.then).toBeTruthy();
            //expect(onSuccess).toHaveBeenCalled();
            //expect(onFailure).toHaveBeenCalled();
        });

    });

    describe('close()', function(){
        beforeEach(function(){
            AuthDialogManager.open({});
        });

        it('should delegate close() to $uibModal', function(){
            AuthDialogManager.close();
            expect(mockedDialog.close).toHaveBeenCalled();
        });

    });

    describe('show custom dialog', function(){
        it('showResetPassword should open modal', function(){
            AuthDialogManager.showResetPassword();
            expect(mockedModal.open).toHaveBeenCalled();
        });

        it('showCheckEmail should open modal', function(){
            AuthDialogManager.showCheckEmail();
            expect(mockedModal.open).toHaveBeenCalled();
        });

        it('showPasswordChanged should open modal', function(){
            AuthDialogManager.showPasswordChanged();
            expect(mockedModal.open).toHaveBeenCalled();
        });

        it('showUpdatePassword should open modal', function(){
            AuthDialogManager.showUpdatePassword();
            expect(mockedModal.open).toHaveBeenCalled();
        });

        it('showDeleteAccount should open modal', function(){
            AuthDialogManager.showDeleteAccount();
            expect(mockedModal.open).toHaveBeenCalled();
        });

        it('showDeleteAccountConfirmRequest should open modal', function(){
            AuthDialogManager.showDeleteAccountConfirmRequest();
            expect(mockedModal.open).toHaveBeenCalled();
        });

        it('showDeleteAccountConfirmation should open modal', function(){
            AuthDialogManager.showDeleteAccountConfirmation();
            expect(mockedModal.open).toHaveBeenCalled();
        });
    });

});
