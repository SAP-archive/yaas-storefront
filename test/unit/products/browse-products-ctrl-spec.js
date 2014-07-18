ddescribe('BrowseProductsCtrl', function () {

    var $scope, $rootScope, $controller, $q, mockedGlobalData, productDeferred, priceDeferred,
        mockedProductSvc, mockedProductResource, browseProdCtrl, mockedPriceSvc, mockedPriceResource;
    mockedGlobalData = {};
    mockedGlobalData.store = {};
    mockedGlobalData.products = {};
    mockedGlobalData.products.meta = {};
    mockedGlobalData.products.meta.total = 10;

    var  products = [
        {'name': 'prod1'}
    ];

    // configure the target controller's module for testing - see angular.mock
    beforeEach(angular.mock.module('ds.products'));

    beforeEach(inject(function(_$rootScope_, _$controller_, _$q_) {

        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });
        $rootScope =  _$rootScope_;
        $scope = _$rootScope_.$new();
        $controller = _$controller_;
        $q = _$q_;
    }));

    beforeEach(function () {
        productDeferred = $q.defer();
        priceDeferred = $q.defer();
        mockedProductResource = {};
        mockedProductResource.$promise = productDeferred.promise;
        mockedProductSvc = {};
        mockedProductSvc.query = jasmine.createSpy('query').andReturn(mockedProductResource);
        mockedPriceResource = {};
        mockedPriceResource.$promise = priceDeferred.promise;
        mockedPriceSvc = {};
        mockedPriceSvc.query = jasmine.createSpy('query').andReturn(mockedPriceResource);

        browseProdCtrl = $controller('BrowseProductsCtrl', {$scope: $scope, 'ProductSvc': mockedProductSvc, 'PriceSvc':mockedPriceSvc, 'GlobalData':mockedGlobalData});

    });

    describe('initialization', function () {
        it('should query products and prices', function () {
            browseProdCtrl = $controller('BrowseProductsCtrl', {$scope: $scope, 'ProductSvc': mockedProductSvc, 'PriceSvc':mockedPriceSvc, 'GlobalData':mockedGlobalData});

            expect(mockedProductSvc.query).toHaveBeenCalled();
            productDeferred.resolve(products);
            $scope.$digest();
            expect(mockedPriceSvc.query).toHaveBeenCalled();
        });
    });

    describe('setSortedPage', function () {
        it('should update current page and query products', function () {

            var page = 4;
            $scope.setSortedPage(page);
            expect(mockedProductSvc.query).toHaveBeenCalled();
        })
    });


    describe('addMore()', function () {

        it(' should query products and add them to the scope if no sorting', function () {
            $scope.products = [];
            $scope.addMore();
            // validate that "add more" added products returned by query to the scope
            expect($scope.products).toEqualData(products);
        });

        it(' should not query products if sorting enabled', function(){
            mockedProductSvc.query.reset();
            $scope.sort = 'price';
            $scope.addMore();
            expect(mockedProductSvc.query.callCount).toBe(0);
        });

    });

    describe('should scroll to top', function () {

        it('should scroll to 0, 0', function () {
            window.scrollTo(0, 5);
            $scope.backToTop();
            expect(window.pageYOffset).toEqualData(0);
        });

    });

});
