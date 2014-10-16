describe('AccountOrderDetailCtrl Test', function () {

    var $scope, $rootScope, $controller, $q;

    var orderUrl = 'http://order-service.dprod.cf.hybris.com';
    var orderRoute = '/orders';
    var productsUrl = 'http://product-service.dprod.cf.hybris.com';
    var productsRoute = '/products';

    //***********************************************************************
    // Common Setup
    // - shared setup between constructor validation and method validation
    //***********************************************************************

    // configure the target controller's module for testing - see angular.mock\
    beforeEach(angular.mock.module('ds.account'), function () {});

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

    describe('AccountOrderDetailCtrl ', function () {
        var mockedOrderSvc, mockedProductSvc, mockedPriceSvc, mockedPricesArray, accountOrderDetailCtrl, mockedOrder, mockedProductsArray, deferredProducts, mockedStateParams, mockedGlobalData;

        beforeEach(function () {

            mockedGlobalData = {
                getCurrencySymbol: jasmine.createSpy('getCurrencySymbol').andReturn('USD')
            };

            // creating the mocked service
            mockedOrderSvc = {
                completeOrder: jasmine.createSpy(),
                delete: jasmine.createSpy()
            };

            mockedProductsArray = [
                {
                    id: 'product1',
                    sku: 'product1',
                    amount: 1
                },
                {
                    id: 'product2',
                    sku: 'product2',
                    amount: 2
                }
            ];

            mockedStateParams = {
                orderId: '12345'
            };

            mockedProductSvc = {};
            deferredProducts = $q.defer();
            deferredProducts.resolve(mockedProductsArray);
            mockedProductSvc.query = jasmine.createSpy('query').andReturn(deferredProducts.promise);

            mockedOrder = {
                id: '12345',
                payments: [
                    {
                        status: 'SUCCESS',
                        method: 'STRIPE',
                        currency: 'USD',
                        paidAmount: 100
                    }
                ],
                totalPrice: 100,
                entries: [
                    {
                        product: {
                            id: 'product1'
                        },
                        sku: 'product1',
                        amount: 1,
                        price: 50
                    },
                    {
                        product: {
                            id: 'product2'
                        },
                        sku: 'product2',
                        amount: 2,
                        price: 25
                    }
                ]
            };

            mockedPricesArray = [
                {'priceId': 'price123', 'productId': 'product1', 'value': '50'},
                {'priceId': 'price456', 'productId': 'product2', 'value': '25'}
            ];

            mockedPricesArray.headers = [];
            var deferredPrices = $q.defer();
            deferredPrices.resolve(mockedPricesArray);
            mockedPriceSvc = {};
            mockedPriceSvc.query = jasmine.createSpy('query').andReturn(deferredPrices.promise);

            $scope.orderProducts = mockedProductsArray;
            angular.forEach(mockedProductsArray, function (entry, key) {
                $scope.orderProducts[key].quantity = entry.amount;
            });

            accountOrderDetailCtrl = $controller('AccountOrderDetailCtrl',
                {$scope: $scope, 'order': mockedOrder, 'ProductSvc': mockedProductSvc, 'PriceSvc': mockedPriceSvc, $stateParams: mockedStateParams, GlobalData: mockedGlobalData});
        });

        it('should parse the payment information', function () {
            expect($scope.payment.currency).toEqualData('USD');
            expect($scope.payment.status).toEqualData('SUCCESS');
            expect($scope.payment.method).toEqualData('STRIPE');
            expect($scope.payment.paidAmount).toEqualData(100);
        });

        it('should get the correct item count', function () {
            expect($scope.itemCount).toEqualData(3);
        });

        it('should get the prices for the products', function () {
            $scope.$digest();
            
            expect($scope.prices.product1.priceId).toEqualData('price123');
            expect($scope.prices.product2.priceId).toEqualData('price456');
            expect($scope.prices.product1.value).toEqualData('50');
            expect($scope.prices.product2.value).toEqualData('25');
        });

    });

});
