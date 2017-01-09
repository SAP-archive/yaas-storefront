describe('SearchListCtrl', function () {

    var $scope, $rootScope, $controller, mockedGlobalData, $q, $location, $timeout, $anchorScroll;
    var searchResult, productResult, priceResult, searchListCtrl, mockedProductSvc, deferredSearchResults, deferredProducts, mockedPriceSvc, defferedPrices, pricesResult,
    mockedYSearchService, mockedSearchString;

    mockedGlobalData = {};
    mockedGlobalData.store = {};
    mockedGlobalData.products = {};
    mockedGlobalData.products.meta = {};
    mockedGlobalData.products.meta.total = 0;
    mockedGlobalData.getCurrencyId = jasmine.createSpy('getCurrencyId').andReturn('USD');
    mockedGlobalData.getCurrencySymbol = jasmine.createSpy('getCurrencySymbol').andReturn('$');
    mockedGlobalData.getSearchRefinements = jasmine.createSpy('getProductRefinements').andReturn([{id:'mostRelevant', name: 'Most Relevant'}]);
    mockedGlobalData.getCurrency = jasmine.createSpy('getCurrency').andReturn('USD');

    var mockedState = { transitionTo: jasmine.createSpy()};

    var mockedSettings = {placeholderImage: 'image', headers: { paging: {total: 'x'}}, eventSource:{ languageUpdate: 'languageUpdate'}};

    mockedYSearchService = {};
    mockedSearchString = '';

    beforeEach(angular.mock.module('ds.searchlist'));

    beforeEach(inject(function(_$rootScope_, _$controller_, _$location_) {

        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });
        $rootScope =  _$rootScope_;
        $scope = _$rootScope_.$new();
        $controller = _$controller_;
        $location = _$location_;
    }));

    var queryResult = [ {
        "product" : {
            "id": "product0",
            "sku" : "1234000",
            "name" : "hybris Coffee Mug - White",
            "description" : "Drink your morning, afternoon, and evening coffee from the hybris mug.  Get caffinated in style. ",
            "published" : true,
            "metadata" : {
                "createdAt" : "2015-05-22T10:17:25.476+0000",
                "modifiedAt" : "2015-05-29T22:39:30.521+0000",
                "version" : 23,
                "mixins" : {
                    "inventory" : "https://api.yaas.io/schema-repository/v1/hybris/inventorySchema-v1"
                }
            },
            "media" : [ {
                "id" : "555f0236c60e4a614dea6f6c",
                "url" : "https://api.yaas.io/hybris/media-repository/b1/sitesettingsproj/hybris.product/media/555f0236c60e4a614dea6f6c",
                "contentType" : "image/jpeg",
                "tags" : [ "main" ],
                "stored" : true,
                "customAttributes" : {
                    "filename" : "mug-coffee-white-1"
                }
            }, {
                "id" : "555f0239b92e219a88a3fb16",
                "url" : "https://api.yaas.io/hybris/media-repository/b1/sitesettingsproj/hybris.product/media/555f0239b92e219a88a3fb16",
                "contentType" : "image/jpeg",
                "tags" : [ "alt" ],
                "stored" : true,
                "customAttributes" : {
                    "filename" : "mug-coffee-white-2"
                }
            }, {
                "id" : "555f023cc60e4a614dea6f6e",
                "url" : "https://api.yaas.io/hybris/media-repository/b1/sitesettingsproj/hybris.product/media/555f023cc60e4a614dea6f6e",
                "contentType" : "image/jpeg",
                "tags" : [ "alt2" ],
                "stored" : true,
                "customAttributes" : {
                    "filename" : "mug-coffee-2-pack"
                }
            }, {
                "id" : "555f023def2e14be3cdebe08",
                "url" : "https://api.yaas.io/hybris/media-repository/b1/sitesettingsproj/hybris.product/media/555f023def2e14be3cdebe08",
                "contentType" : "image/jpeg",
                "tags" : [ "alt3" ],
                "stored" : true,
                "customAttributes" : {
                    "filename" : "mug-coffee-espresso"
                }
            } ],
            "mixins" : {
                "inventory" : {
                    "inStock" : true
                }
            },
            "customAttributes" : [ ]
        },
        "prices" : [ {
            "priceId" : "55671ca009cefeef5b6c1d97",
            "originalAmount" : 8.99,
            "effectiveAmount" : 8.99,
            "currency" : "USD"
        } ]
    }, {
        "product" : {
            "id" : "product1",
            "sku" : "1234003",
            "name" : "hybris Executive Pen",
            "description" : "The pen that makes an executive statement. Stylish pen in silver an black. The perfect accessory for any meeting or conference. ",
            "published" : true,
            "metadata" : {
                "createdAt" : "2015-05-22T10:18:50.953+0000",
                "modifiedAt" : "2015-05-22T10:19:04.502+0000",
                "version" : 6,
                "mixins" : {
                    "inventory" : "https://api.yaas.io/schema-repository/v1/hybris/inventorySchema-v1"
                }
            },
            "media" : [ {
                "id" : "555f028cc60e4a614dea6f70",
                "url" : "https://api.yaas.io/hybris/media-repository/b1/sitesettingsproj/hybris.product/media/555f028cc60e4a614dea6f70",
                "contentType" : "image/jpeg",
                "tags" : [ "main" ],
                "stored" : true,
                "customAttributes" : {
                    "filename" : "pen-executive-1",
                    "main" : true
                }
            }, {
                "id" : "555f029024aef06f5e028fa2",
                "url" : "https://api.yaas.io/hybris/media-repository/b1/sitesettingsproj/hybris.product/media/555f029024aef06f5e028fa2",
                "contentType" : "image/jpeg",
                "tags" : [ "alt" ],
                "stored" : true,
                "customAttributes" : {
                    "filename" : "pen-executive-2"
                }
            } ],
            "mixins" : {
                "inventory" : {
                    "inStock" : true
                }
            },
            "customAttributes" : [ ]
        },
        "prices" : [ {
            "priceId" : "5548a78d75ee66d3db00532f",
            "originalAmount" : 29.99,
            "effectiveAmount" : 29.99,
            "currency" : "USD"
        } ]
    }];


    beforeEach(inject(function (_$q_) {

        $q = _$q_;
        mockedProductSvc = {};

        mockedYSearchService.init = jasmine.createSpy('init');
        mockedSearchString = 'prod';

        mockedPriceSvc = {};
        pricesResult = [
        ];
        pricesResult.headers = [];
        defferedPrices = $q.defer();
        defferedPrices.resolve(pricesResult);
        mockedPriceSvc.getPrices = jasmine.createSpy('getPrices').andReturn(defferedPrices.promise);
        mockedPriceSvc.getPricesMapForProducts = jasmine.createSpy('getPricesMapForProducts').andReturn(defferedPrices.promise);
    }));

    describe('Initialization', function () {

        var selectedCat;

        beforeEach(function () {
            productResult = queryResult;
            productResult.headers =  [];
            deferredProducts = $q.defer();
            deferredProducts.resolve(productResult);
            mockedProductSvc.queryProductList = jasmine.createSpy('queryProductList').andReturn(deferredProducts.promise);

            searchResults = {
                hits: [
                    { 'id': 'product0' },
                    { 'id': 'product1' }]
            };
            deferredSearchResults = $q.defer();
            deferredSearchResults.resolve(searchResults);

            mockedYSearchService.getResults = jasmine.createSpy('getResults').andReturn(deferredSearchResults.promise);

            searchListCtrl = $controller('SearchListCtrl',
                {'$scope': $scope, '$rootScope': $rootScope, 'ProductSvc': mockedProductSvc, 'GlobalData':mockedGlobalData,
                    'settings': mockedSettings, '$state': mockedState, '$location': $location ,'ysearchSvc': mockedYSearchService, 'searchString': mockedSearchString, 'PriceSvc': mockedPriceSvc});

        });

        it('should init algolia search', function(){
            expect(mockedYSearchService.init).toHaveBeenCalled();
        });

        it('should set image placeholder', function(){
            expect($scope.PLACEHOLDER_IMAGE).toBeTruthy();
        });

        it('should query products', function () {
            $scope.products = [];

            // trigger promise resolution:
            $scope.$digest();
            expect(mockedYSearchService.getResults).toHaveBeenCalled();

            // trigger promise resolution:
            $scope.$digest();
            expect(mockedProductSvc.queryProductList).toHaveBeenCalled();
            // indirect testing via resolved promise
            expect($scope.products).toEqualData(productResult);
        });

    });

    describe('Initializing without product found', function(){
        beforeEach(function () {
            productResult = [];
            productResult.headers =  [];
            deferredProducts = $q.defer();
            deferredProducts.resolve(productResult);
            mockedProductSvc.queryProductList = jasmine.createSpy('queryProductList').andReturn(deferredProducts.promise);


            searchResults = {hits: []};
            deferredSearchResults = $q.defer();
            deferredSearchResults.resolve(searchResults);

            mockedYSearchService.getResults = jasmine.createSpy('getResults').andReturn(deferredSearchResults.promise);

            searchListCtrl = $controller('SearchListCtrl',
                {'$scope': $scope, '$rootScope': $rootScope, 'ProductSvc': mockedProductSvc, 'GlobalData':mockedGlobalData,
                    'settings': mockedSettings, '$state': mockedState, '$location': $location ,'ysearchSvc': mockedYSearchService, 'searchString': 'dummyString', 'PriceSvc': mockedPriceSvc});

        });

        it('should set count properties to zero', function(){

            expect($scope.products).toEqualData([]);
            expect($scope.pagination.productsFrom).toEqualData(1);
            expect($scope.pagination.productsTo).toEqualData(1);
        });

    });

    describe('function', function() {
        beforeEach(function () {
            productResult = queryResult;
            productResult.headers =  [];
            deferredProducts = $q.defer();
            deferredProducts.resolve(productResult);
            mockedProductSvc.queryProductList = jasmine.createSpy('queryProductList').andReturn(deferredProducts.promise);

            searchResults = {
                hits: [
                    {'id': 'product0'},
                    {'id': 'product1'}]
            };
            deferredSearchResults = $q.defer();
            deferredSearchResults.resolve(searchResults);

            mockedYSearchService.getResults = jasmine.createSpy('getResults').andReturn(deferredSearchResults.promise);

            searchListCtrl = $controller('SearchListCtrl',
                {'$scope': $scope, '$rootScope': $rootScope, 'ProductSvc': mockedProductSvc, 'GlobalData':mockedGlobalData,
                    'settings': mockedSettings, '$state': mockedState, '$location': $location ,'ysearchSvc': mockedYSearchService, 'searchString': mockedSearchString, 'PriceSvc': mockedPriceSvc});
        });


        describe('addMore', function () {

            it('should query products and add them to the scope if no sorting', function () {
                $scope.products = [];
                $scope.addMore();

                $scope.$digest();
                expect(mockedYSearchService.getResults).toHaveBeenCalled();
                $scope.$digest();
                expect(mockedProductSvc.queryProductList).toHaveBeenCalled();
            });

            it('should not query products if sorting enabled', function () {
                $scope.sort = 'price';
                mockedProductSvc.queryProductList.reset();
                $scope.addMore();
                expect(mockedProductSvc.queryProductList.callCount).toBe(0);
            });

        });


        describe('backToTop', function () {
            it('should scroll to 0, 0', function () {
                window.scrollTo(0, 5);
                $scope.backToTop();
                expect(window.pageYOffset).toEqualData(0);
            });
        });

        describe('showRefineContainer', function(){
            it('should toggle refineContainerShowing', function(){
                $scope.refineContainerShowing = false;
                $scope.showRefineContainer();
                expect($scope.refineContainerShowing).toBeTruthy();
                $scope.showRefineContainer();
                expect($scope.refineContainerShowing).toBeFalsy();
            });
        });

    });

});