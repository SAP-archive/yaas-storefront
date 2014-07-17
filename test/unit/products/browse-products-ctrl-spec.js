describe('BrowseProductsCtrl Test', function () {

    var $scope, $rootScope, $controller, mockedGlobalData;
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

            // creating the mocked service
            mockedProductSvc = {
                query: jasmine.createSpy(),
                queryWithResultHandler: jasmine.createSpy()
            };

            mockedPriceSvc = {
                query: jasmine.createSpy(),
                queryWithResultHandler: jasmine.createSpy()
            };

            browseProdCtrl = $controller('BrowseProductsCtrl', {$scope: $scope, 'ProductSvc': mockedProductSvc, 'PriceSvc':mockedPriceSvc, 'GlobalData':mockedGlobalData});
            expect(mockedProductSvc.queryWithResultHandler).toHaveBeenCalled();
        });


        it('setSortedPage should update current page and query products', function(){

            var page = 4;
            $scope.setSortedPage(page);
            expect(mockedProductSvc.queryWithResultHandler).toHaveBeenCalled();
        })

    });

    describe('BrowseProductsCtrl - addMore', function () {

        var products, browseProdCtrl, stubbedProductSvc, mockedPriceSvc;

        beforeEach(function () {

            products = [
                {'name': 'prod1'}
            ];

            // stubbing a service with callback
            stubbedProductSvc = {
                queryWithResultHandler: function (parms, callback) {
                    callback(products);
                },
                query: jasmine.createSpy()

            };

            mockedPriceSvc = {
                query: jasmine.createSpy(),
                queryWithResultHandler: jasmine.createSpy()
            };

            browseProdCtrl = $controller('BrowseProductsCtrl', {$scope: $scope, 'ProductSvc': stubbedProductSvc, 'PriceSvc':mockedPriceSvc, 'GlobalData':mockedGlobalData})
        });

        it('should query products on initialization', function () {
            $scope.products = [];
            // manual injection of the mocked service into the controller
            browseProdCtrl = $controller('BrowseProductsCtrl', {$scope: $scope, 'ProductSvc': stubbedProductSvc, 'PriceSvc':mockedPriceSvc, 'GlobalData':mockedGlobalData});
            expect($scope.products).toEqualData(products);
        });

        it(' should query products and add them to the scope if no sorting', function () {
            $scope.products = [];
            $scope.addMore();
            // validate that "add more" added products returned by query to the scope
            expect($scope.products).toEqualData(products);
        });

        it(' should not query products if sorting enabled', function(){
            $scope.sort = 'price';
            stubbedProductSvc.query.reset();
            $scope.addMore();
            expect(stubbedProductSvc.query.callCount).toBe(0);
        });

    });

    describe('BrowseProductsCtrl - should scroll to top', function () {

        var browseProdCtrl, stubbedProductSvc, mockedPriceSvc;

        beforeEach(function () {

            // stubbing a service with callback
            stubbedProductSvc = {
                queryWithResultHandler: jasmine.createSpy(),
                query: jasmine.createSpy()

            };

            mockedPriceSvc = {
                query: jasmine.createSpy(),
                queryWithResultHandler: jasmine.createSpy()
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
