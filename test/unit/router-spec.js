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

describe('Product list router test', function () {

    var scope, ctrl, $state, $injector, $httpBackend;

    beforeEach(module('ds.router'));

    beforeEach(function () {
        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });

        inject(function(_$httpBackend_, $rootScope, _$state_, _$injector_) {
            $httpBackend = _$httpBackend_;
            scope = $rootScope.$new();
            $state = _$state_;
            $injector = _$injector_;
        });

        $httpBackend.whenGET('public/js/app/products/templates/product-list.html').respond({});
        $httpBackend.whenGET('public/js/app/shared/templates/navigation.html').respond({});
        $httpBackend.whenGET('public/js/app/shared/templates/header.html').respond({});
        $httpBackend.whenGET('public/js/app/shared/templates/footer.html').respond({});
        $httpBackend.whenGET('public/js/app/home/templates/body.html').respond({});
        $httpBackend.whenGET('public/js/app/home/templates/home.html').respond({});

        $httpBackend.whenGET('http://product-service-dprod.deis-dev-01.ytech.fra.hybris.com//products?pageNumber=1&pageSize=15')
            .respond([{name: 'Shirt'}, {name: 'Hat'}]);

    });

    it('state change should trigger URL change', function() {
       expect($state.href('base.products')).toEqualData('#!/products/');
    });

    /*
        We need a test to make sure the state's resolve populates the shirt and hat into scope.products
     */

});