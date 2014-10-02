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
describe('CategorySvc', function () {


    var categoryUrl = 'https://yaas-test.apigee.net/test/category/v1/categories';

    var $scope, $rootScope, $httpBackend, categorySvc;
    var acceptLang = "de";
    var mockedGlobalData = {acceptLanguages: acceptLang};

    var categoryResponse = [ {
        "id" : "117767936",
        "name" : "Accessories"
    }, {
        "id" : "117767168",
        "name" : "Office Supply"
    }, {
        "id" : "117770496",
        "name" : "Computer Accessories"
    }, {
        "id" : "117771264",
        "name" : "Cosmetics"
    }];

    beforeEach(module('restangular'));
    beforeEach(angular.mock.module('ds.products', function ($provide) {
        $provide.value('GlobalData', mockedGlobalData);
    }));


    beforeEach(function () {
        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });

        inject(function (_$httpBackend_, _$rootScope_, _CategorySvc_) {
            $rootScope = _$rootScope_;
            $scope = _$rootScope_.$new();
            $httpBackend = _$httpBackend_;
            categorySvc = _CategorySvc_;
        });
    });

    describe('getCategories', function(){

        it('issues GET and stores categories map in GlobalData', function () {
            $httpBackend.expectGET(categoryUrl).respond(categoryResponse);

            var products = categorySvc.query();

            $httpBackend.flush();
            expect(products.$object.length).toBeDefined();
            expect(products.$object.length).toEqual(prodList.length);
            for (var i = 0, prod; i < products.$object.length; i++) {
                prod = products.$object[i];
                expect(prod.name).toEqualData(prodList[i].name);
            };
        });

        it('sets accept-language header', function(){

            $httpBackend.expectGET(categoryUrl, {"accept-language":acceptLang,"Accept":"application/json, text/plain, */*"}).respond({});

            categorySvc.query();
            $httpBackend.flush();

        });
    });

    describe('getCategory()', function(){

    });

    describe('getProducts()', function(){

    });





});
