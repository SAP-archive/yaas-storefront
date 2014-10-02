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

    var cosmeticsId = "117771264";
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
        "id" : cosmeticsId,
        "name" : "Cosmetics"
    }];

    var mockedCatId = 'catId';
    var mockedCatName = 'catName';

    beforeEach(module('restangular'));
    beforeEach(angular.mock.module('ds.products', function ($provide) {
        var catMap = {};
        catMap[mockedCatId] = {name: mockedCatName};
        mockedGlobalData.categoryMap = catMap;
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

            var cats = categorySvc.getCategories();

            $httpBackend.flush();
            expect(cats).toBeDefined();

            var cat = mockedGlobalData.categoryMap[cosmeticsId];
            expect(cat.name).toEqualData('Cosmetics');
        });

        it('sets accept-language header', function(){
            $httpBackend.expectGET(categoryUrl, {"accept-language":acceptLang,"Accept":"application/json, text/plain, */*"}).respond([]);
            categorySvc.getCategories();
            $httpBackend.flush();
        });
    });

    describe('getCategory()', function () {
        it('should return category from GlobalData if loaded', function () {
            var cat = null;
            categorySvc.getCategory(mockedCatId).then(function (category) {
                cat = category;
            });
            $scope.$apply();
            expect(cat).toBeTruthy();
            expect(cat.name).toEqualData(mockedCatName);
            $httpBackend.verifyNoOutstandingRequest();
        });


        it('should load categories from service if GlobalData not set', function () {
            categorySvc.clearCategoryCache();

            $httpBackend.expectGET(categoryUrl).respond(categoryResponse);

            var cat = null;
            categorySvc.getCategory(cosmeticsId).then(function(category){
                cat = category;
            });
            $httpBackend.flush();
            expect(cat.name).toEqualData('Cosmetics');
        });


    });

    describe('getProducts()', function(){
        it('should GET elements for category id', function(){
           $httpBackend.expectGET(categoryUrl+'/'+cosmeticsId+'/elements').respond([]);
            categorySvc.getProducts(cosmeticsId);
            $httpBackend.flush();
        });
    });





});
