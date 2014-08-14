describe('BrowseProductsCtrl', function () {

    var $scope, $rootScope, $controller, mockedGlobalData, mockedThen, $q;
    mockedGlobalData = {};
    mockedGlobalData.store = {};
    mockedGlobalData.products = {};
    mockedGlobalData.products.meta = {};
    mockedGlobalData.products.meta.total = 10;

    //***********************************************************************
    // Common Setup
    // - shared setup between constructor validation and method validation
    //***********************************************************************

    // configure the target controller's module for testing - see angular.mock
    beforeEach(angular.mock.module('ds.products'));

    beforeEach(inject(function(_$rootScope_, _$controller_) {

        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });
        $rootScope =  _$rootScope_;
        $scope = _$rootScope_.$new();
        $controller = _$controller_;
    }));

    describe('BrowseProductsCtrl ', function () {
        var mockedProductSvc, browseProdCtrl, mockedPriceSvc;


        beforeEach(function () {

            mockedThen = jasmine.createSpy();
            // creating the mocked service
            mockedProductSvc = {
                query: jasmine.createSpy().andReturn({
                    then: mockedThen
                })
            };

            mockedPriceSvc = {
                query: jasmine.createSpy()
            };

            browseProdCtrl = $controller('BrowseProductsCtrl', {$scope: $scope, 'ProductSvc': mockedProductSvc, 'PriceSvc':mockedPriceSvc, 'GlobalData':mockedGlobalData});
            // expect(mockedProductSvc.queryWithResultHandler).toHaveBeenCalled();
        });

        it('should initialize image placeholder', function(){
            expect($scope.PLACEHOLDER_IMAGE).toBeTruthy();
        });

        it('setSortedPage should update current page and query products', function(){

            var page = 4;
            $scope.setSortedPage(page);
            expect(mockedProductSvc.query).toHaveBeenCalled();
            expect($scope.pageNumber).toEqual(page);
        })

    });

    describe('addMore', function () {

        var products, browseProdCtrl, stubbedProductSvc, mockedPriceSvc;

        beforeEach(inject(function ($q) {

            $q = $q;

            products = [
                {'name': 'prod1'}
            ];

            mockedThen = jasmine.createSpy();

            // stubbing a service with callback
            stubbedProductSvc = {
                query: jasmine.createSpy().andReturn({
                    then: mockedThen
                })
            };

            mockedPriceSvc = {
                query: jasmine.createSpy(),
                queryWithResultHandler: jasmine.createSpy()
            };

            browseProdCtrl = $controller('BrowseProductsCtrl', {$scope: $scope, 'ProductSvc': stubbedProductSvc, 'PriceSvc':mockedPriceSvc, 'GlobalData':mockedGlobalData});
        }));

        it('should query products on initialization', function () {
            $scope.products = [];
            // manual injection of the mocked service into the controller
            browseProdCtrl = $controller('BrowseProductsCtrl', {$scope: $scope, 'ProductSvc': stubbedProductSvc, 'PriceSvc':mockedPriceSvc, 'GlobalData':mockedGlobalData});
            expect(stubbedProductSvc.query).wasCalled();
            // expect($scope.products).toEqualData(products);
        });

        it(' should query products and add them to the scope if no sorting', function () {
            $scope.products = [];
            $scope.addMore();
            // validate that "add more" added products returned by query to the scope
            expect(stubbedProductSvc.query).wasCalled();
            // expect($scope.products).toEqualData(products);
        });

        it(' should not query products if sorting enabled', function(){
            $scope.sort = 'price';
            stubbedProductSvc.query.reset();
            $scope.addMore();
            expect(stubbedProductSvc.query.callCount).toBe(0);
        });

    });

    describe('should scroll to top', function () {

        var browseProdCtrl, stubbedProductSvc, mockedPriceSvc;

        beforeEach(function () {

            mockedThen = jasmine.createSpy();

            // stubbing a service with callback
            stubbedProductSvc = {

                query: jasmine.createSpy().andReturn({
                    then: mockedThen
                })

            };

            mockedPriceSvc = {
                query: jasmine.createSpy()
            };

            browseProdCtrl = $controller('BrowseProductsCtrl', {$scope: $scope, 'ProductSvc': stubbedProductSvc, 'PriceSvc':mockedPriceSvc, 'GlobalData':mockedGlobalData})
        });

        it('should scroll to 0, 0', function () {
            window.scrollTo(0, 5);
            $scope.backToTop();
            expect(window.pageYOffset).toEqualData(0);
        });

    });

});