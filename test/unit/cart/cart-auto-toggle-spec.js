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

describe('cartAutoToggle Test', function () {

    var $rootScope, element;

    //***********************************************************************
    // Common Setup
    // - shared setup between constructor validation and method validation
    //***********************************************************************

    // configure the target controller's module for testing - see angular.mock
    beforeEach(angular.mock.module('ds.cart'));

    beforeEach(inject(function(_$rootScope_, _$compile_) {

        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });

        element = angular.element(
                '<div cart-auto-toggle class="cartContainer" ng-mouseenter="cartHover()" ng-mouseleave="cartUnHover()">' +
                    '<span name="cartSpan">Cart is Showing</span>' +
                '</div>'
        );

        $rootScope =  _$rootScope_;
        _$compile_(element)($rootScope);
    }));

    describe('handle the cart opening and closing functionality', function(){

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
