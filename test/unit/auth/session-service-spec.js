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

describe('SessionSvc', function () {

    var mockedState, $q, $scope, SessionSvc, accountDef, settings, mockedStateParams = {},
    mockedAccountSvc = {
            updateAccount: jasmine.createSpy()
        },
        mockedCartSvc = {
            refreshCartAfterLogin: jasmine.createSpy(),
            resetCart: jasmine.createSpy()
        },
        mockedGlobalData = {
            getCurrencyId: function(){
                return 'USD'
            },
            setCurrency: jasmine.createSpy(),

            getLanguageCode: function(){
                return 'en'
            },

            setLanguage: jasmine.createSpy(),

            customerAccount: {}
        };

    mockedState = {
        is: jasmine.createSpy('is').andReturn(true),
        go: jasmine.createSpy('go'),
        transitionTo: jasmine.createSpy(),
        data: {auth: 'authenticated'}
    };


    beforeEach(module('ds.shared'));
    beforeEach(module('ds.auth', function($provide) {
        $provide.value('AccountSvc', mockedAccountSvc);
        $provide.value('CartSvc', mockedCartSvc);
        $provide.value('GlobalData', mockedGlobalData);
        $provide.value('$state', mockedState);
        $provide.value('$stateParams', mockedStateParams);
    }));

    beforeEach(inject(function(_SessionSvc_,  _$q_, _$rootScope_, _settings_) {
        SessionSvc = _SessionSvc_;
        $q = _$q_;
        $scope = _$rootScope_.$new();
        settings = _settings_;
    }));

    describe('afterLoginFromSignUp()', function(){

        var updatedAccount;
        beforeEach(function(){
            accountDef = $q.defer();
            mockedAccountSvc.account = jasmine.createSpy('account').andCallFake(function(){
                return accountDef.promise;
            });
            var account = {id: 'abc'};
            SessionSvc.afterLoginFromSignUp();
            accountDef.resolve(account);
            $scope.$apply();
        });

        it('should request cart for logged in user', function(){
            expect(mockedCartSvc.refreshCartAfterLogin).toHaveBeenCalled();
        });
    });

    describe('afterLogIn()', function(){

        beforeEach(function(){
            accountDef = $q.defer();
            mockedAccountSvc.account = jasmine.createSpy('account').andCallFake(function(){
                return accountDef.promise;
            });

        });

        it('should get account data', function(){
            SessionSvc.afterLogIn();
            expect(mockedAccountSvc.account).wasCalled();
        });
        
        it('should navigate to target state if indicated', function(){
            var account = {id: 'abc'};
            var toState = 'target';
            SessionSvc.afterLogIn({targetState: toState});
            accountDef.resolve(account);
            $scope.$apply();
            expect(mockedState.go).wasCalledWith(toState, {});
        });

        it('should navigate to target state even if account lookup failed', function(){
            var account = {id: 'abc'};
            var toState = 'target';
            SessionSvc.afterLogIn({targetState: toState});
            accountDef.reject(account);
            $scope.$apply();
            expect(mockedState.go).wasCalledWith(toState, {});
        });

        it('should retrieve any open cart for the current user', function(){
            var account = {id: 'abc'};
            SessionSvc.afterLogIn();
            accountDef.resolve(account);
            $scope.$apply();
            expect(mockedCartSvc.refreshCartAfterLogin).toHaveBeenCalled();
        });

    });

    describe('afterLogOut()', function(){

        it('should set current customer to null', function(){
            SessionSvc.afterLogOut();
            expect(mockedGlobalData.customerAccount).toBeFalsy();
        });

        it('should navigate to home page if current state is protected', function(){
            SessionSvc.afterLogOut();
            expect(mockedState.go).wasCalledWith( 'base.home');
        });

        it('should reset the cart', function(){
            SessionSvc.afterLogOut();
            expect(mockedCartSvc.resetCart).toHaveBeenCalled();
        });
    });

    describe('afterSocialLogin()', function(){

        var profile = {firstName: 'first', lastName: 'lastName', email: 'email'};
        var meDef;

        beforeEach(function(){
           meDef = $q.defer();
           mockedAccountSvc.getCurrentAccount = jasmine.createSpy().andCallFake(function(){
             return meDef.promise;
           });
        });

        it('should get current account and update name and email', function(){

            SessionSvc.afterSocialLogin(profile);
            meDef.resolve({});
            $scope.$apply();
            expect(mockedAccountSvc.updateAccount).toHaveBeenCalledWith({ firstName: profile.firstName, lastName: profile.lastName,
            contactEmail: profile.email});
        });
    });

});
