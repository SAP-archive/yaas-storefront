describe('CheckoutCtrl Test', function () {

    var $scope, $rootScope, $controller;

    //***********************************************************************
    // Common Setup
    // - shared setup between constructor validation and method validation
    //***********************************************************************

    // configure the target controller's module for testing - see angular.mock
    beforeEach(angular.mock.module('ds.checkout'));

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

    describe('CheckoutCtrl', function () {
        var mockedOrderSvc, mockedCartSvc, checkoutCtrl;

        beforeEach(function () {
            var mockedOrderSvc = $injector.get( 'OrderSvc' );
            mockedOrderSvc.createOrder = jasmine.createSpy('createOrder');
            var mockedCartSvc = $injector.get('CartSvc');
            mockedCartSvc.getCart = jasmine.createSpy('getCart');
        });

        it('should initialize', function () {
            checkoutCtrl = $controller('CheckoutCtrl', {$scope: $scope, 'OrderSvc': mockedOrderSvc});
            expect(checkoutCtrl).toBeTruthy();
        })

        it('should invoke OrderSvc on placeOrder', function(){
            checkoutCtrl = $controller('CheckoutCtrl', {$scope: $scope, 'OrderSvc': mockedOrderSvc});
            checkoutCtrl.placeOrder();
            expect(mockedOrderSvc.createOrder).toHaveBeenCalled();
            expect(mockedCartSvc.getCart).toHaveBeenCalled();
        });
    });



});
