/*
unit tests will go here
*/

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
'use strict';

describe('Router test', function () {

    var $rootScope, $state, $injector;

    beforeEach(module('ds.router'));
    beforeEach(function () {
        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });

        inject(function(_$rootScope_, _$state_, _$injector_) {
            $rootScope = _$rootScope_;
            $state = _$state_;
            $injector = _$injector_;
        });

    });

    it('state change should trigger URL change', function() {
        $state.go('base.products');
        $rootScope.$digest();
        expect($state.current.url).toEqual('/products/');
    });

    it('product detail route should prompt product get', function() {
        $state.go('base.product-detail');
        $rootScope.$digest();
        expect($state.current.url).toEqual('/prodetail/:productSku');
    });

});