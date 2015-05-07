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

describe('handle account creation panel', function(){
    var $compile, $rootScope;
    var mockedSettings = {};
    var mockedAuthSvc = {
        requestPasswordReset: jasmine.createSpy('requestPasswordReset').andCallFake(function(){
            return deferredPwReset.promise;
        }),
        changePassword: jasmine.createSpy('changePassword').andCallFake(function(){
            return deferredChangePassword.promise;
        })
    }

    module(function($provide){
        module('ds.auth');
        $provide.value('AuthSvc', mockedAuthSvc);
        $provide.value('settings', mockedSettings);
    });

    beforeEach(inject(function(_$compile_, _$rootScope_){
        $compile = _$compile_;
        $rootScope = _$rootScope_;
    }));

    it('should access the directive members signup', function() {
        var element = $compile("<div create-account ></div>")($rootScope);
        $rootScope.$digest();
        // expect($rootScope.signup).toBeDefined();
    });

});

