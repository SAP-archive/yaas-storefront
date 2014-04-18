describe('CheckoutCtrl Test', function () {

    var $scope, $rootScope, $controller, $injector;

    //***********************************************************************
    // Common Setup
    // - shared setup between constructor validation and method validation
    //***********************************************************************

    // configure the target controller's module for testing - see angular.mock
    beforeEach(angular.mock.module('ds.checkout'));

    beforeEach(inject(function(_$rootScope_, _$controller_, _$injector_) {

        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });
        $rootScope =  _$rootScope_;
        $scope = _$rootScope_.$new();
        $controller = _$controller_;
        $injector = _$injector_;
    }));

    describe('CheckoutCtrl', function () {
        var mockedOrderSvc, mockedCartSvc, checkoutCtrl;

        beforeEach(function () {
            mockedOrderSvc = $injector.get( 'OrderSvc' );
            mockedOrderSvc.createOrder = jasmine.createSpy('createOrder');
            mockedCartSvc = $injector.get('CartSvc');
            mockedCartSvc.getCart = jasmine.createSpy('getCart');
            checkoutCtrl = $controller('CheckoutCtrl', {$scope: $scope, 'OrderSvc': mockedOrderSvc, 'CartSvc': mockedCartSvc});
        });

        it('should initialize', function () {
            expect(checkoutCtrl).toBeTruthy();
        })

        it('should invoke pass cart from CartSvc to OrderSvc on placeOrder', function(){
            $scope.placeOrder();
            expect(mockedOrderSvc.createOrder).toHaveBeenCalled();
            expect(mockedCartSvc.getCart).toHaveBeenCalled();
        });
    });



});
