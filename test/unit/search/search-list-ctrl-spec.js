describe('SearchListCtrl', function () {

    var $scope, $rootScope, $controller, mockedGlobalData, $q, $location, $timeout, $anchorScroll;
    var searchResult, productResult, priceResult, searchListCtrl, mockedProductSvc, mockedPriceSvc, deferredSearchResults, deferredProducts, deferredPrices,
    mockedYSearchService, mockedSearchString;

    mockedGlobalData = {};
    mockedGlobalData.store = {};
    mockedGlobalData.products = {};
    mockedGlobalData.products.meta = {};
    mockedGlobalData.products.meta.total = 0;
    mockedGlobalData.getCurrencyId = jasmine.createSpy('getCurrencyId').andReturn('USD');
    mockedGlobalData.getCurrencySymbol = jasmine.createSpy('getCurrencySymbol').andReturn('$');


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


    beforeEach(inject(function (_$q_) {

        $q = _$q_;
        mockedProductSvc = {};

        priceResult = [
            {
                'currency': 'USD',
                'priceId': 'price1',
                'productId': 'product1',
                'value': '3.00'
            }
        ];
        deferredPrices = $q.defer();
        deferredPrices.resolve(priceResult);

        mockedPriceSvc = {};
        mockedPriceSvc.query =  jasmine.createSpy('query').andReturn(deferredPrices.promise);


        mockedYSearchService.init = jasmine.createSpy('init');
          mockedSearchString = 'prod';
    }));

    describe('Initialization', function () {

        var selectedCat;

        beforeEach(function () {
            productResult = [
                {'id': 'product1', 'name': 'product1', media: [{url: 'http://prod1url1'}, {url: 'http://prod1url2'}]},
                {'id': 'product2', 'name': 'product2', media: [{url: 'http://prod2url1;', customAttributes:{}}, {url: 'http://prod2url2', customAttributes:{main: true}}] },
            ];
            productResult.headers =  [];
            deferredProducts = $q.defer();
            deferredProducts.resolve(productResult);
            mockedProductSvc.query = jasmine.createSpy('query').andReturn(deferredProducts.promise);

            searchResults = {
                hits: [
                    {'id': 'product1'},
                    {'id': 'product2'}]
            };
            deferredSearchResults = $q.defer();
            deferredSearchResults.resolve(searchResults);

            mockedYSearchService.getResults = jasmine.createSpy('getResults').andReturn(deferredSearchResults.promise);

            searchListCtrl = $controller('SearchListCtrl',
                {'$scope': $scope, '$rootScope': $rootScope, 'ProductSvc': mockedProductSvc, 'PriceSvc':mockedPriceSvc, 'GlobalData':mockedGlobalData,
                    'settings': mockedSettings, '$state': mockedState, '$location': $location ,'ysearchSvc': mockedYSearchService, 'searchString': mockedSearchString});

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
            expect(mockedProductSvc.query).toHaveBeenCalled();
            // indirect testing via resolved promise
            expect($scope.products).toEqualData(productResult);
        });

        it('should use first URL if no <<main>> image', function(){
            $scope.$digest();
            expect($scope.products[0].mainImageURL).toEqualData('http://prod1url1');
        });

        it('should use the main image URL if present', function(){
            $scope.$digest();
            expect($scope.products[1].mainImageURL).toEqualData('http://prod2url2');
        });

    });

    describe('Initializing without product found', function(){
        beforeEach(function () {
            productResult = [];
            productResult.headers =  [];
            deferredProducts = $q.defer();
            deferredProducts.resolve(productResult);
            mockedProductSvc.query = jasmine.createSpy('query').andReturn(deferredProducts.promise);


            searchResults = {hits: []};
            deferredSearchResults = $q.defer();
            deferredSearchResults.resolve(searchResults);

            mockedYSearchService.getResults = jasmine.createSpy('getResults').andReturn(deferredSearchResults.promise);

            searchListCtrl = $controller('SearchListCtrl',
                {'$scope': $scope, '$rootScope': $rootScope, 'ProductSvc': mockedProductSvc, 'PriceSvc':mockedPriceSvc, 'GlobalData':mockedGlobalData,
                    'settings': mockedSettings, '$state': mockedState, '$location': $location ,'ysearchSvc': mockedYSearchService, 'searchString': 'dummyString'});

        });

        it('should set count properties to zero', function(){

            expect($scope.products).toEqualData([]);
            expect($scope.pagination.productsFrom).toEqualData(1);
            expect($scope.pagination.productsTo).toEqualData(1);
        });

    });

    describe('function', function() {
        beforeEach(function () {
            productResult = [
                {'id': 'product1', 'name': 'product1', media: [{url: 'http://prod1url1'}, {url: 'http://prod1url2'}]},
                {'id': 'product2', 'name': 'product2', media: [{url: 'http://prod2url1;', customAttributes:{}}, {url: 'http://prod2url2', customAttributes:{main: true}}] },
            ];
            productResult.headers =  [];
            deferredProducts = $q.defer();
            deferredProducts.resolve(productResult);
            mockedProductSvc.query = jasmine.createSpy('query').andReturn(deferredProducts.promise);

            searchResults = {
                hits: [
                    {'id': 'product1'},
                    {'id': 'product2'}]
            };
            deferredSearchResults = $q.defer();
            deferredSearchResults.resolve(searchResults);

            mockedYSearchService.getResults = jasmine.createSpy('getResults').andReturn(deferredSearchResults.promise);

            searchListCtrl = $controller('SearchListCtrl',
                {'$scope': $scope, '$rootScope': $rootScope, 'ProductSvc': mockedProductSvc, 'PriceSvc':mockedPriceSvc, 'GlobalData':mockedGlobalData,
                    'settings': mockedSettings, '$state': mockedState, '$location': $location ,'ysearchSvc': mockedYSearchService, 'searchString': mockedSearchString});
        });


        describe('addMore', function () {

            it('should query products and add them to the scope if no sorting', function () {
                $scope.products = [];
                $scope.addMore();

                $scope.$digest();
                expect(mockedYSearchService.getResults).toHaveBeenCalled();
                $scope.$digest();
                expect(mockedProductSvc.query).toHaveBeenCalled();
            });

            it('should not query products if sorting enabled', function () {
                $scope.sort = 'price';
                mockedProductSvc.query.reset();
                $scope.addMore();
                expect(mockedProductSvc.query.callCount).toBe(0);
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