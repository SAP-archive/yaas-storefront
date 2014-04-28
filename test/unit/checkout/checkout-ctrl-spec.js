xdescribe('CheckoutCtrl Test', function () {

    var $scope, $rootScope, $controller, $injector, mockedOrderSvc, mockedCartSvc, checkoutCtrl;
    var mockBillTo = {'firstName': 'Bob', 'lastName':'Sushi'};

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

    beforeEach(function () {
        mockedOrderSvc = $injector.get( 'OrderSvc' );
        mockedOrderSvc.createOrder = jasmine.createSpy('createOrder');
        mockedCartSvc = $injector.get('CartSvc');
        mockedCartSvc.getCart = jasmine.createSpy('getCart');
        checkoutCtrl = $controller('CheckoutCtrl', {$scope: $scope, 'OrderSvc': mockedOrderSvc, 'CartSvc': mockedCartSvc});
    });

    describe('Initialization', function () {
        it('should initialize', function () {
            expect(checkoutCtrl).toBeTruthy();
            expect($scope.order).toBeTruthy();
            expect($scope.wiz).toBeTruthy();

            expect($scope.order.shippingCost).toEqualData(3);
        })
    });

    describe('Wizard in Mobile - step completion', function () {
        beforeEach(function () {
            $scope.wiz.step1Done = false;
            $scope.wiz.step2Done = false;
            $scope.wiz.step3Done = false;
        });

        it('should set Step 1 Done when bill to entered', function(){
            $scope.wiz.step1Done = false;
            $scope.billToDone();
            expect($scope.wiz.step1Done).toEqualData(true);
            expect($scope.wiz.step2Done).toEqualData(false);
            expect($scope.wiz.step2Done).toEqualData(false);
        });

        it('should set Step 2 Done when ship to to entered', function(){
            $scope.wiz.step2Done = false;
            $scope.shipToDone();
            expect($scope.wiz.step2Done).toEqualData(true);
            expect($scope.wiz.step3Done).toEqualData(false);
        });

        it('should set Step 3 Done when shipping entered', function(){
            $scope.wiz.step3Done = false;
            $scope.paymentDone();
            expect($scope.wiz.step3Done).toEqualData(true);
        });

    });

    describe('Wizard in Mobile - Editing Complete Information', function () {
        beforeEach(function () {
            $scope.wiz.step1Done = true;
            $scope.wiz.step2Done = true;
            $scope.wiz.step3Done = true;
        });

        it(' (Bill To) should set Steps 1,2, 3 undone', function () {

            $scope.editBillTo();
            expect($scope.wiz.step1Done).toEqualData(false);
            expect($scope.wiz.step2Done).toEqualData(false);
            expect($scope.wiz.step3Done).toEqualData(false);
        });

        it(' (Ship To) should set Steps 2, 3 undone', function () {

            $scope.editShipTo();
            expect($scope.wiz.step1Done).toEqualData(true);
            expect($scope.wiz.step2Done).toEqualData(false);
            expect($scope.wiz.step3Done).toEqualData(false);
        });

        it(' (Shipping) should set Steps 3 undone', function () {
            $scope.editPayment();
            expect($scope.wiz.step1Done).toEqualData(true);
            expect($scope.wiz.step2Done).toEqualData(true);
            expect($scope.wiz.step3Done).toEqualData(false);
        });

    });

    describe('setShipToSameAsBillTo ', function () {

        it('should copy billing to shipping', function(){
            $scope.order.billTo = mockBillTo;
            $scope.setShipToSameAsBillTo();
            expect($scope.order.shipTo).toEqualData(mockBillTo);
        });


    });

    describe('Place Order ', function () {
        var mockedOrderSvc, mockedCartSvc, checkoutCtrl;

        beforeEach(function () {
            mockedOrderSvc = $injector.get( 'OrderSvc' );
            mockedOrderSvc.createOrder = jasmine.createSpy('createOrder');
            mockedCartSvc = $injector.get('CartSvc');
            mockedCartSvc.getCart = jasmine.createSpy('getCart');
            checkoutCtrl = $controller('CheckoutCtrl', {$scope: $scope, 'OrderSvc': mockedOrderSvc, 'CartSvc': mockedCartSvc, '$timeout': $timeout});
        });

        it('should initialize', function () {
            expect(checkoutCtrl).toBeTruthy();
        })

        it('should invoke pass cart from CartSvc to OrderSvc on placeOrder', function(){
            $scope.placeOrder();
            expect(mockedOrderSvc.createOrder).toHaveBeenCalled();
            expect(mockedCartSvc.getCart).toHaveBeenCalled();
        });

        it('should ensure ship to copy', function(){
            $scope.order.billTo = mockBillTo;
            $scope.wiz.shipToSameAsBillTo = true;
            $scope.placeOrder();
            expect($scope.order.shipTo).toEqualData(mockBillTo);
        });
    });



});
