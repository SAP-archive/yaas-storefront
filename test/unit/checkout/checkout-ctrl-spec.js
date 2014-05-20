describe('CheckoutCtrl Test', function () {

    var $scope, $rootScope, $controller, $injector, mockedCheckoutSvc, checkoutCtrl, order, cart;
    var mockBillTo = {'firstName': 'Bob', 'lastName':'Sushi'};

    //***********************************************************************
    // Common Setup
    // - shared setup between constructor validation and method validation
    //***********************************************************************

    beforeEach(module('ds.checkout', function($provide) {
        order = {};
        order.shipTo = {};
        cart = {};
        order.creditCard = {};
        mockedCheckoutSvc =  {}
        mockedCheckoutSvc.checkout = jasmine.createSpy('checkout');

        $provide.value('CheckoutSvc', mockedCheckoutSvc);

        $provide.value('cart', cart);
        $provide.value('order', order);
    }));


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
        checkoutCtrl = $controller('CheckoutCtrl', {$scope: $scope, "CheckoutSvc": mockedCheckoutSvc});
    });

    describe('Initialization', function () {
        it('should initialize', function () {
            expect(checkoutCtrl).toBeTruthy();
            expect($scope.order).toBeTruthy();
            expect($scope.wiz).toBeTruthy();
        })
    });

    describe('Mobile Wizard Step completion ', function () {
        beforeEach(function () {
            $scope.wiz.step1Done = false;
            $scope.wiz.step2Done = false;
            $scope.wiz.step3Done = false;
            $scope.showPristineErrors = false;
        });

        it('should set Step 1 Done when Bill-To to entered', function(){
            $scope.billToDone(true);
            expect($scope.wiz.step1Done).toEqualData(true);
            expect($scope.wiz.step2Done).toEqualData(false);
            expect($scope.wiz.step2Done).toEqualData(false);
            expect($scope.showPristineErrors).toEqualData(false);
        });

        it('should leave Step 1 In Progress when invalid Bill-To entered', function(){
            $scope.billToDone(false);
            expect($scope.wiz.step1Done).toEqualData(false);
            expect($scope.wiz.step2Done).toEqualData(false);
            expect($scope.wiz.step2Done).toEqualData(false);
            expect($scope.showPristineErrors).toEqualData(true);
        });

        it('should remove PRISTINE_ERRORS upon valid re-edit of Bill-To', function(){
            $scope.showPristineErrors = true;
            $scope.billToDone(true);
            expect($scope.showPristineErrors).toEqualData(false);
        });

        it('should set Step 2 Done when ship to to entered', function(){
            $scope.wiz.step2Done = false;
            $scope.shipToDone(true);
            expect($scope.wiz.step2Done).toEqualData(true);
            expect($scope.wiz.step3Done).toEqualData(false);
        });

        it('should set Step 3 Done when shipping entered', function(){
            $scope.wiz.step3Done = false;
            $scope.paymentDone(true, 'form');
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

        beforeEach(function () {
            $scope.showPristineErrors = false;
        });

        it('should initialize', function () {
            expect(checkoutCtrl).toBeTruthy();
        })

        it('should invoke CheckoutSvc create order if form valid', function(){
            $scope.placeOrder(true);
            expect(mockedCheckoutSvc.checkout).toHaveBeenCalled();
        });

        it('should not place order if form invalid', function(){
            $scope.placeOrder(false);
            expect(mockedCheckoutSvc.checkout).wasNotCalled();
        });

        it('should show pristine errors if form invalid', function(){
            $scope.placeOrder(false);
            expect($scope.showPristineErrors).toEqualData(true);
        });

        it('should ensure ship to copy', function(){
            order.billTo = mockBillTo;
            $scope.wiz.shipToSameAsBillTo = true;
            $scope.placeOrder(true);
            expect(order.shipTo).toEqualData(mockBillTo);
        });

        it('should show error on failed order placement', function(){

        });
    });



});
