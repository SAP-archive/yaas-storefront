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

ddescribe('directive: create account', function() {
    var scope,
        elem,
        directive,
        compiled,
        html;

    // beforeEach(function (){
    //     module('ds.auth');

    //     elem = angular.element('<div ng-include=\"\'js/app/auth/templates/create-account.html\'\" create-account ></div>');

    //     inject(function($compile, $rootScope) {
    //         scope = $rootScope.$new();

    //         compiled = $compile(elem);

    //         compiled(scope);
    //     });
    // });

    beforeEach(inject(function(_$rootScope_, _$compile_) {

        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });

        element = angular.element('<div ng-include=\"\'js/app/auth/templates/create-account.html\'\" create-account ></div>');

        $rootScope =  _$rootScope_;
        _$compile_(element)($rootScope);
    }));

    describe('handle account creation signup', function(){

        it('should call createCartTimeout and close the cart after 3 seconds', function(){
            $rootScope.showCart = true;
            $rootScope.$emit('cart:closeAfterTimeout');
            $rootScope.$digest();
            setTimeout(function() {
                expect($rootScope.showCart).toEqualData(false);
            },4000);
            $rootScope.$digest();
        });

        it('should close the cart now', function(){
            $rootScope.showCart = true;
            $rootScope.$emit('cart:closeNow');
            expect($rootScope.showCart).toEqualData(false);
        });
    });


});