describe('BrowseProductsCtrl', function () {

    var $scope, $rootScope, $controller, $q, mockedGlobalData, productDeferred, priceDeferred,
        mockedProductSvc, mockedProductResource, browseProdCtrl, mockedPriceSvc, mockedPriceResource;
    mockedGlobalData = {};
    mockedGlobalData.store = {};
    mockedGlobalData.products = {};
    mockedGlobalData.products.meta = {};
    mockedGlobalData.products.meta.total = 10;

    var products = [
        {'name': 'prod1'}
    ];

    var prices = {"prices": [
        {
            "price": 24.57,
            "productId": "53b42e3129ce2176d046b5d3",
            "currencyId": "USD",
            "priceId": "53b42e3129ce2176d046b5d4",
            "creationDate": "2014-07-02T16:07:13.708+0000",
            "lastUpdate": "2014-07-02T16:07:13.708+0000"
        }
    ]};

    var mappedPrices = { "53b42e3129ce2176d046b5d3": {
        "price": 24.57,
        "productId": "53b42e3129ce2176d046b5d3",
        "currencyId": "USD",
        "priceId": "53b42e3129ce2176d046b5d4",
        "creationDate": "2014-07-02T16:07:13.708+0000",
        "lastUpdate": "2014-07-02T16:07:13.708+0000"
    }
    };

    // configure the target controller's module for testing
    beforeEach(angular.mock.module('ds.products'));

    beforeEach(inject(function (_$rootScope_, _$controller_, _$q_) {

        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });
        $rootScope = _$rootScope_;
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

        browseProdCtrl = $controller('BrowseProductsCtrl', {$scope: $scope, 'ProductSvc': mockedProductSvc, 'PriceSvc': mockedPriceSvc, 'GlobalData': mockedGlobalData});
        // initialization invokes API call - go through the motions to flush out and reset
        productDeferred.resolve(products);
        $scope.$digest();
        priceDeferred.resolve(prices);
        $scope.$digest();
        // reset
        $scope.products = [];
        mockedProductSvc.query.reset();
    });

    describe('initialization', function () {
        it('should query products and prices', function () {
            browseProdCtrl = $controller('BrowseProductsCtrl', {$scope: $scope, 'ProductSvc': mockedProductSvc, 'PriceSvc': mockedPriceSvc, 'GlobalData': mockedGlobalData});

            expect(mockedProductSvc.query).toHaveBeenCalled();
            productDeferred.resolve(products);
            $scope.$digest();
            expect($scope.products).toBeTruthy();
            expect(mockedPriceSvc.query).toHaveBeenCalled();
            priceDeferred.resolve(prices);
            $scope.$digest();
            expect($scope.prices).toBeTruthy();
        });
    });

    describe('setSortedPage()', function () {
        var page = 4;

        it('should query products, map prices and add them to the scope if no sorting', function () {
            $scope.sort = 'price';
            $scope.setSortedPage(page);
            expect(mockedProductSvc.query).toHaveBeenCalled();
            productDeferred.resolve(products);
            $scope.$digest();
            expect($scope.products).toBeTruthy();
            expect(mockedPriceSvc.query).toHaveBeenCalled();
            priceDeferred.resolve(prices);
            $scope.$digest();
            expect($scope.prices).toEqualData(mappedPrices);
        });

        it('should not query products if sorting disabled', function () {
            $scope.sort = '';
            $scope.setSortedPage(page);
            expect(mockedProductSvc.query.callCount).toBe(0);
        });
    });

    describe('addMore()', function () {

        it('should query products,  map prices and add them to the scope if no sorting', function () {
            $scope.addMore();

            expect(mockedProductSvc.query).toHaveBeenCalled();
            productDeferred.resolve(products);
            $scope.$digest();
            expect($scope.products).toEqualData(products);
            expect(mockedPriceSvc.query).toHaveBeenCalled();
            priceDeferred.resolve(prices);
            $scope.$digest();
            expect($scope.prices).toEqualData(mappedPrices);
        });

        it('should not query products if sorting enabled', function () {
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
