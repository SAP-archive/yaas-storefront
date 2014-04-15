/**
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
describe('ProductSvc Test', function () {

    var productUrl = 'http://product-service-dprod.deis-dev-01.ytech.fra.hybris.com';
    var productRoute = 'products' ;
    var $scope, $rootScope, $httpBackend, productSvc;


    beforeEach(angular.mock.module('ds.products', function(caasProvider) {

        caasProvider.setBaseRoute(productUrl);
        caasProvider.endpoint('products', { productSku: '@productSku' }).route(productRoute);
    }));


    beforeEach(function () {
        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });

        inject(function(_$httpBackend_, _$rootScope_, _ProductSvc_) {
            $rootScope = _$rootScope_;
            $scope = _$rootScope_.$new();

            $httpBackend  = _$httpBackend_;
            productSvc = _ProductSvc_;
        });
    });



        it('query returns product array', function () {
            expect(productSvc).toBeTruthy();
            $httpBackend.expectGET('http://product-service-dprod.deis-dev-01.ytech.fra.hybris.com/products').respond([
                {name: 'Shirt'},
                {name: 'Hat'}
            ]);

            var products = productSvc.query();

            expect(products).toBeUndefined();

            $httpBackend.flush();

            expect(products).toEqualData({"products": [
                {name: 'Shirt'},
                {name: 'Hat'}
            ]});
        });
            /*

            */


        /*
         it('query with callback invokes it on resolved promise', function () {

         })   */


});
