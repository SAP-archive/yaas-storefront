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

    var $scope, $rootScope, $httpBackend, categorySvc, categoryUrl;
    var acceptLang = "de";
    var mockedGlobalData = { getAcceptLanguages: function(){ return acceptLang}, getCurrencyId: function(){return 'USD'}};

    var cosmeticsId = "117771264";
    var cosmeticsSlug = 'cosmetics~'+cosmeticsId;
    var mockedCatId = 'catId';
    var mockedCatName = 'catName';
    var mockedSlug = 'catname~'+mockedCatId;
    var mockedState = {
        go: jasmine.createSpy()
    };

    var categoryResponse = [ {
        "id" : "117767936",
        "name" : "Accessories"
    }, {
        "id" : "117767168",
        "name" : "Office Supply"
    }, {
        "id" : "117770496",
        "name" : "Computer Accessories",
        "subcategories": [
            {"id": "9876", "name": "Keyboards"},
            {"id": "5432", "name": "Mice"}
        ]
    }, {
        "id" : cosmeticsId,
        "name" : "Cosmetics"
    }];


    var catQueryPath = '?expand=subcategories&toplevel=true';

    beforeEach(module('restangular'));
    beforeEach(angular.mock.module('ds.products', function ($provide) {
        var catMap = {};
        catMap[mockedSlug] = {name: mockedCatName, slug: mockedSlug, id:mockedCatId};
        mockedGlobalData.categoryMap = catMap;
        $provide.value('GlobalData', mockedGlobalData);
        $provide.value('$state', mockedState);
    }));


    beforeEach(function () {
        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });

        module('ds.shared', function($provide){
            $provide.value('appConfig', {});
        });

        inject(function (_$httpBackend_, _$rootScope_, _CategorySvc_, SiteConfigSvc) {
            $rootScope = _$rootScope_;
            $scope = _$rootScope_.$new();
            $httpBackend = _$httpBackend_;
            categorySvc = _CategorySvc_;
            siteConfig = SiteConfigSvc;
            categoryUrl = siteConfig.apis.categories.baseUrl + 'categories';
        });
    });

    describe('getCategories', function(){

        it('issues GET for first request only', function () {
            $httpBackend.expectGET(categoryUrl+catQueryPath).respond(categoryResponse);

            var cats;
            categorySvc.getCategories().then(function(result){
                cats = result;
            });

            $httpBackend.flush();
            expect(cats).toBeDefined();

            cats = null;
            cats = categorySvc.getCategoriesFromCache();
            expect(cats).toBeDefined();
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('sets accept-language header', function(){
            $httpBackend.expectGET(categoryUrl+catQueryPath, {"accept-language":"de","hybris-currency":"USD","Accept":"application/json, text/plain, */*"}).respond([]);
            categorySvc.getCategories();
            $httpBackend.flush();
        });
    });

    describe('getCategoryById', function(){
       it('should retrieve the category from map if cached', function(){
           $httpBackend.expectGET(categoryUrl+catQueryPath).respond(categoryResponse);
           categorySvc.getCategories();
           $httpBackend.flush();
           var cat = null;
           categorySvc.getCategoryById(cosmeticsId).then(function(result){
               cat = result;
           });
           $scope.$apply();
           expect(cat).toBeTruthy();
           expect(cat.name).toEqualData('Cosmetics');
       });

        it('should not load category if it doesn\'t have a name', function(){
            $httpBackend.expectGET(categoryUrl+catQueryPath).respond([{
                "id": cosmeticsId
            }]);

            categorySvc.getCategories();
            $httpBackend.flush();
            var cat = null;
            categorySvc.getCategoryById(cosmeticsId).then(function(result){
                cat = result;
            });
            $scope.$apply();
            expect(cat).toBeFalsy();
        });

        it('should retrieve the category server if none cached', function(){
            $httpBackend.expectGET(categoryUrl+catQueryPath).respond(categoryResponse);
            var cat = null;
            categorySvc.getCategoryById(cosmeticsId).then(function(result){
                cat = result;
            });
            $httpBackend.flush();
            $scope.$apply();
            expect(cat).toBeTruthy();
            expect(cat.name).toEqualData('Cosmetics');
        });
    });

    describe('getCategoryWithProducts()', function () {
        it('should return category with products', function () {
            categorySvc.resetCategoryCache();
            $httpBackend.expectGET(categoryUrl+catQueryPath).respond(categoryResponse);
            $httpBackend.expectGET(categoryUrl+'/'+cosmeticsId+'/assignments?recursive=true').respond([]);
            var cat = null;
            categorySvc.getCategoryWithProducts(cosmeticsSlug).then(function (category) {
                cat = category;
            });
            $scope.$apply();
            $httpBackend.flush();
            expect(cat).toBeTruthy();
            expect(cat.name).toEqualData('Cosmetics');
            $httpBackend.verifyNoOutstandingRequest();

            cat = null;
            $httpBackend.expectGET(categoryUrl+'/'+cosmeticsId+'/assignments?recursive=true').respond([]);
            categorySvc.getCategoryWithProducts(cosmeticsSlug).then(function (category) {
                cat = category;
            });
            $scope.$apply();
            $httpBackend.flush();
            expect(cat).toBeTruthy();
            expect(cat.name).toEqualData('Cosmetics');
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('should return null category for invalid slug', function(){
            var cat = null;
            $httpBackend.expectGET(categoryUrl+catQueryPath).respond(categoryResponse);
            categorySvc.getCategoryWithProducts('slug').then(function (category) {
                cat = category;
            });
            $scope.$apply();
            $httpBackend.flush();
            expect(cat).toBeFalsy();
        });

        it('should return null cartegory for null slug', function(){
            var cat= null;
            categorySvc.getCategoryWithProducts(null).then(function (category) {
                cat = category;
            });
            $scope.$apply();
            expect(cat).toBeFalsy();
        });

    });

});
