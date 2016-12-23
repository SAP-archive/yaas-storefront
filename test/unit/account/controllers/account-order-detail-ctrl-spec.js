describe('AccountOrderDetailCtrl Test', function () {

    var $scope, $rootScope, $controller, $q, modalPromise;

    var orderUrl = 'http://order-service.dprod.cf.hybris.com';
    var orderRoute = '/orders';
    var productsUrl = 'http://product-service.dprod.cf.hybris.com';
    var productsRoute = '/products';
    var mockedModal = {};


    //***********************************************************************
    // Common Setup
    // - shared setup between constructor validation and method validation
    //***********************************************************************

    // configure the target controller's module for testing - see angular.mock\
    beforeEach(module('ds.account', function ($provide) {
        $provide.value('$uibModal', mockedModal);
    }));

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
        modalPromise = $q.defer();
        mockedModal.close = jasmine.createSpy('close');
        mockedModal.result = modalPromise.promise;
        mockedModal.open =  jasmine.createSpy('open').andReturn(mockedModal);
        mockedModal.opened = {then:function(){}};
    }));

    describe('AccountOrderDetailCtrl ', function () {
        var mockedOrderSvc, accountOrderDetailCtrl, mockedOrder, mockedStateParams, mockedGlobalData;

        beforeEach(function () {

            mockedGlobalData = {
                getCurrencySymbol: jasmine.createSpy('getCurrencySymbol').andReturn('$'),
                getCurrencyId: function() {return 'USD'}
            };

            // creating the mocked service
            mockedOrderSvc = {
                completeOrder: jasmine.createSpy(),
                delete: jasmine.createSpy()
            };

            mockedStateParams = {
                orderId: '12345'
            };

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
                shippingCost: 0.00,
                tax: 0.00,
                currency: 'USD',
                totalPrice: 100,
                entries: [
                    {
                        product: {
                            name: 'product1'
                        },
                        sku: 'product1',
                        amount: 1,
                        unitPrice: 50.00,
                        totalPrice: 50.00,
                        id: 'product1'
                    },
                    {
                        product: {
                            name: 'product2'
                        },
                        sku: 'product2',
                        amount: 2,
                        unitPrice: 25.00,
                        totalPrice: 50.00,
                        id: 'product1'
                    }
                ]
            };

            accountOrderDetailCtrl = $controller('AccountOrderDetailCtrl',
                {$scope: $scope, 'order': mockedOrder, $stateParams: mockedStateParams, GlobalData: mockedGlobalData});
        });

        it('should expose right interface', function() {
            expect($scope.cancelOrder).toBeDefined();
            expect($scope.showCancelBtn).toBeDefined();
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

        it("should open the order cancel dialog when calling cancelOrder method", function() {
            $scope.cancelOrder();
            expect(mockedModal.open).toHaveBeenCalled();
            modalPromise.resolve({status: 'DECLINED'});
            $scope.$digest();
            expect($scope.order.status).toBe('DECLINED');
        });

        it('should correctly decide wether or not to display cancel order button', function() {
            expect($scope.showCancelBtn({status: 'CREATED'})).toBeTruthy();
            expect($scope.showCancelBtn({status: 'CONFIRMED'})).toBeTruthy();
            expect($scope.showCancelBtn({status: 'SHIPPED'})).toBeFalsy();
            expect($scope.showCancelBtn({status: 'COMPLETED'})).toBeFalsy();
            expect($scope.showCancelBtn({status: 'DECLINED'})).toBeFalsy();
        });

    });

});
