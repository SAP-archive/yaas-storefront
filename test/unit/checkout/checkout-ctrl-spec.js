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

        it('should leave Step 2 In Progress when invalid Ship-To entered', function(){
            $scope.wiz.step2Done = false;
            $scope.wiz.shipToSameAsBillTo = false;
            $scope.shipToDone(false);
            expect($scope.wiz.step2Done).toEqualData(false);
            expect($scope.wiz.step3Done).toEqualData(false);
            expect($scope.showPristineErrors).toEqualData(true);
        });

        it('should set Step 3 Done when shipping entered', function(){
            $scope.wiz.step3Done = false;
            $scope.paymentDone(true, 'form');
            expect($scope.wiz.step3Done).toEqualData(true);
        });

        it('should leave Step 3 In Progress when invalid Payment entered', function(){
            $scope.wiz.step3Done = false;
            $scope.paymentDone(false);
            expect($scope.wiz.step3Done).toEqualData(false);
            expect($scope.showPristineErrors).toEqualData(true);
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

        it('should show default error msg if form invalid', function(){
            $scope.placeOrder(false);
            expect($scope.message).toEqualData('Please correct the errors above before placing your order.');
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

    describe('Stripe Error Handling', function(){
        var stripeError, errorMsg, setValidityMock;
        var fieldErrorMsg = 'Please correct the errors above before placing your order.';
        beforeEach(function(){
            $scope.checkoutForm = {};
            $scope.checkoutForm.paymentForm ={};
            $scope.checkoutForm.paymentForm.ccNumber = {};
            setValidityMock =  jasmine.createSpy('$setValidity');
            $scope.checkoutForm.paymentForm.ccNumber.$setValidity = setValidityMock;
            $scope.checkoutForm.paymentForm.cvc = {};
            $scope.checkoutForm.paymentForm.cvc.$setValidity = setValidityMock;
            $scope.checkoutForm.paymentForm.expMonth = {};
            $scope.checkoutForm.paymentForm.expMonth.$setValidity = setValidityMock;
            $scope.checkoutForm.paymentForm.expYear = {};
            $scope.checkoutForm.paymentForm.expYear.$setValidity = setValidityMock;

            errorMsg = 'msg';
            stripeError = {};
            stripeError.message = errorMsg;
            stripeError.code = 'number';
            stripeError.type = 'card_error'
            var checkout = function(data, stripeCallback, orderCallback) {
                stripeCallback(stripeError);
            };
            mockedCheckoutSvc.checkout = checkout;

            $scope.wiz.step1Done = true;
            $scope.wiz.step2Done = true;
            $scope.wiz.step3Done = true;
            $scope.message = false;
        });

        it('should edit payment on card error', function(){

            $scope.placeOrder(true);
            expect($scope.wiz.step3Done).toEqualData(false);
        });

        it('should set error message', function(){
            stripeError.type = null;
            $scope.placeOrder(true);
            expect($scope.message).toEqualData('Not able to pre-validate payment at this time.');
        });


        it('should update validity on cc number error', function(){
            $scope.placeOrder(true);
            expect(setValidityMock).toHaveBeenCalled();
            expect($scope.message).toEqualData(fieldErrorMsg);
        });

        it('should update validity on cvc error', function(){
            stripeError.code = 'cvc';
            $scope.placeOrder(true);
            expect(setValidityMock).toHaveBeenCalled();
            expect($scope.message).toEqualData(fieldErrorMsg);
        });

        it('should update validity on month error', function(){
            stripeError.code = 'month';
            $scope.placeOrder(true);
            expect(setValidityMock).toHaveBeenCalled();
            expect($scope.message).toEqualData(fieldErrorMsg);
            expect($scope.checkoutForm.paymentForm.expDateMsg).toBeTruthy();
        });

        it('should update validity on year error', function(){
            stripeError.code = 'year';
            $scope.placeOrder(true);
            expect(setValidityMock).toHaveBeenCalled();
            expect($scope.message).toEqualData(fieldErrorMsg);
            expect($scope.checkoutForm.paymentForm.expDateMsg).toBeTruthy();
        });
    });

    describe('reset CC expiration date errors', function(){
        var setValidityMock;

        beforeEach(function(){
            setValidityMock =  jasmine.createSpy('$setValidity');
            $scope.checkoutForm = {};
            $scope.checkoutForm.paymentForm ={};
            $scope.checkoutForm.paymentForm.expMonth = {};
            $scope.checkoutForm.paymentForm.expMonth.$setValidity = setValidityMock;
            $scope.checkoutForm.paymentForm.expYear = {};
            $scope.checkoutForm.paymentForm.expYear.$setValidity = setValidityMock;
            $scope.resetExpDateErrors();
        });

        it('should reset the submission message', function(){
           expect($scope.message).toBeFalsy();
        });

        it('should reset the CC expiration date error message', function(){
            expect($scope.checkoutForm.paymentForm.expDateMsg).toBeFalsy();
        });

        it('should reset validity of date fields', function(){
            expect(setValidityMock).toHaveBeenCalledWith('validation',true);
        });

    });

    describe('reset custom field error', function(){
       var setValidityMock;
        beforeEach(function(){
            setValidityMock =  jasmine.createSpy('$setValidity');
            $scope.checkoutForm = {};
            $scope.checkoutForm.paymentForm ={};
            $scope.checkoutForm.paymentForm.ccNumber = {};
            $scope.checkoutForm.paymentForm.ccNumber.$setValidity = setValidityMock;
            $scope.checkoutForm.paymentForm.ccNumber.msg = 'Bad Error';
            $scope.resetErrorMsg($scope.checkoutForm.paymentForm.ccNumber);
        });

        it('should reset the submission message', function(){
            expect($scope.message).toBeFalsy();
        });

        it('should reset the field error message', function(){
            expect($scope.checkoutForm.paymentForm.ccNumber.msg).toBeFalsy();
        });

        it('should reset validity of the field', function(){
            expect(setValidityMock).toHaveBeenCalledWith('validation',true);
        });
    });

});
