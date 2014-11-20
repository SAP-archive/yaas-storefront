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
    var mockedGlobalData = { getAcceptLanguages: function(){ return acceptLang}};

    var cosmeticsId = "117771264";
    var cosmeticsSlug = 'cosmetics~'+cosmeticsId;
    var mockedCatId = 'catId';
    var mockedCatName = 'catName';
    var mockedSlug = 'catname~'+mockedCatId;

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


    var catQueryPath = '?expand=subcategories&toplevel=true';

    beforeEach(module('restangular'));
    beforeEach(angular.mock.module('ds.products', function ($provide) {
        var catMap = {};
        catMap[mockedSlug] = {name: mockedCatName, slug: mockedSlug, id:mockedCatId};
        mockedGlobalData.categoryMap = catMap;
        $provide.value('GlobalData', mockedGlobalData);
    }));


    beforeEach(function () {
        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });

        module('ds.shared', function($provide){
            $provide.value('storeConfig', {});
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

            var cats = categorySvc.getCategories();

            $httpBackend.flush();
            expect(cats).toBeDefined();

            categorySvc.getCategories();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('sets accept-language header', function(){
            $httpBackend.expectGET(categoryUrl+catQueryPath, {"accept-language":acceptLang,"Accept":"application/json, text/plain, */*"}).respond([]);
            categorySvc.getCategories();
            $httpBackend.flush();
        });
    });

    describe('getCategoryWithProducts()', function () {
        it('should return category with products', function () {
            categorySvc.resetCategoryCache();
            $httpBackend.expectGET(categoryUrl+catQueryPath).respond(categoryResponse);
            $httpBackend.expectGET(categoryUrl+'/'+cosmeticsId+'/elements?recursive=true').respond([]);
            var cat = null;
            categorySvc.getCategoryWithProducts(cosmeticsSlug).then(function (category) {
                cat = category;
            });
            $scope.$apply();
            $httpBackend.flush();
            expect(cat).toBeTruthy();
            expect(cat.name).toEqualData('Cosmetics');
            $httpBackend.verifyNoOutstandingRequest();
        });

    });



});
