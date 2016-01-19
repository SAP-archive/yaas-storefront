describe('CheckoutCtrl', function () {

    var $scope, $rootScope, $controller, $injector, $q, mockedCheckoutSvc, mockedShippingSvc, mockedCartSvc, checkoutCtrl, order, cart, checkoutDfd, shippingDfd, cartDfd,
        $modal, mockedModal, shippingZones, shippingCountries, MockedAuthSvc, accountDef, addressDef, addressesDef, returnAddress,
        returnAddresses, returnAccount, MockedAccountSvc;
    var isAuthenticated;
    var GlobalData = {
        user: {
            isAuthenticated: '',
            user: null
        },
        getCurrency: jasmine.createSpy().andReturn('USD'),
        getCurrencyId: jasmine.createSpy().andReturn('USD'),
        getCurrencySymbol: jasmine.createSpy().andReturn('$'),
        getUserTitles: jasmine.createSpy().andReturn(['', 'MR', 'MS', 'MRS', 'DR']),
        getSiteCode: function () {
            return 'US';
        }
    };
    var CouponSvc = {
    };
    var mockCoupon = {
            code: '',
            applied: false,
            valid: true,
            message : {
                error: 'Code not valid',
                success: 'Applied'
            },
            amounts : {
                originalAmount: 0,
                discountAmount: 0
            }
        };
    var UserCoupon = {
        getCoupon:function(){
            return mockCoupon;
        }
    };
    var AuthDialogManager = {
        isOpened: jasmine.createSpy('then'),
        open: jasmine.createSpy('then').andReturn({
            result: {
                then: jasmine.createSpy('then')
            }
        }),
        close: jasmine.createSpy('dismiss')
    };
    var ERROR_TYPES = {
            stripe: 'STRIPE_ERROR',
            order: 'ORDER_ERROR'
        };
    var mockBillTo = {'firstName': 'Bob', 'lastName':'Sushi'};
    var mockedState = {};
    mockedState.go = jasmine.createSpy('go');
    var formName = 'checkoutForm';

    //***********************************************************************
    // Common Setup
    // - shared setup between constructor validation and method validation
    //***********************************************************************


    beforeEach(module('ds.checkout', function($provide) {
        order = {};
        order.shipTo = {};
        order.billTo = {};
        cart = {};
        order.creditCard = {};
        shippingCountries = ['CA', 'US'];
        mockedCheckoutSvc =  {
            ERROR_TYPES: ERROR_TYPES
        };

        mockedShippingSvc = {
            ERROR_TYPES: ERROR_TYPES
        };

        mockedCartSvc = {
            ERROR_TYPES: ERROR_TYPES
        };
        mockedModal = {
            open: jasmine.createSpy('open').andReturn({
                opened: {
                    then: jasmine.createSpy('then')
                },
                close: jasmine.createSpy('close'),
                dismiss: jasmine.createSpy('dismiss')
            })
        };
        isAuthenticated = true;
        MockedAuthSvc = {
            isAuthenticated: jasmine.createSpy('isAuthenticated').andReturn(isAuthenticated)
        };
        GlobalData.user.isAuthenticated = true;
        $provide.value('cart', cart);
        $provide.value('order', order);
        $provide.value('shippingZones', shippingZones);
        $provide.value('shippingCountries', shippingCountries);
        $provide.value('$state', mockedState);
        $provide.value('$modal', mockedModal);
    }));

    beforeEach(inject(function(_$rootScope_, _$controller_, _$injector_, _$q_, _$modal_, _$httpBackend_) {

        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });
        $rootScope =  _$rootScope_;
        $q =  _$q_;
        $scope = _$rootScope_.$new();
        $controller = _$controller_;
        $injector = _$injector_;
        $modal = _$modal_;
        _$httpBackend_.whenGET(/^[A-Za-z-/]*\.html/).respond({});
    }));

    beforeEach(function () {
        checkoutDfd = $q.defer();
        shippingDfd = $q.defer();
        cartDfd = $q.defer();
        mockedCheckoutSvc.checkout = jasmine.createSpy('checkout').andCallFake(function() {
            return checkoutDfd.promise;
        });

        mockedShippingSvc.getShippingCosts = jasmine.createSpy('shipping').andCallFake(function() {
            return shippingDfd.promise;
        });

        mockedShippingSvc.getMinimumShippingCost = jasmine.createSpy('shipping').andCallFake(function() {
            return shippingDfd.promise;
        });

        

        mockedCartSvc.reformatCartItems = jasmine.createSpy();

        returnAccount = {
            contactEmail: 'mike@hybris.com',
            title: 'Dr.',
            firstName: 'Mike',
            middleName: 'R',
            lastName: 'ODonnell'
        };

        returnAddress = {
            contactName: 'Mike',
            street: '123 Main St',
            streetAppendix: 'Apt 2',
            country: 'US',
            city: 'Boulder',
            state: 'CO',
            zipCode: '80302',
            contactPhone: '555-555-5555',
            isDefault: true
        };

        returnAddresses = [];
        returnAddresses.push(returnAddress);

        accountDef = $q.defer();
        accountDef.resolve(returnAccount);
        addressDef = $q.defer();

        addressesDef = $q.defer();
        addressesDef.resolve(returnAddresses);
        MockedAccountSvc = {
            account: jasmine.createSpy('account').andReturn(accountDef.promise),
            getDefaultAddress: jasmine.createSpy('getDefaultAddress').andCallFake(function(){
                return addressDef.promise
            }),
            getAddresses: jasmine.createSpy('getAddresses').andReturn(addressesDef.promise)
        };
        $scope.cart = {
            items : [],
        totalUnitsCount: 0,
        subTotalPrice : {
            value: 0
        },
        totalPrice : {
            value:0
         },
        id: '566fe8c5452e61c47f141239',
        shipping : {
            fee: {
                amount: 0
            }
        }
        };
        checkoutCtrl = $controller('CheckoutCtrl', {$scope: $scope, CheckoutSvc: mockedCheckoutSvc, ShippingSvc: mockedShippingSvc, CartSvc: mockedCartSvc, AuthDialogManager: AuthDialogManager, AuthSvc: MockedAuthSvc, AccountSvc: MockedAccountSvc, GlobalData: GlobalData, CouponSvc: CouponSvc, UserCoupon: UserCoupon});
    });

    describe('initialization', function () {
        it('should create default instances', function () {
            expect(checkoutCtrl).toBeTruthy();
            expect($scope.order).toBeTruthy();
        });


        it('should retrieve addresses for authenticated user', function(){

            checkoutCtrl = $controller('CheckoutCtrl', {$scope: $scope, CheckoutSvc: mockedCheckoutSvc, ShippingSvc: mockedShippingSvc, CartSvc: mockedCartSvc, AuthDialogManager: AuthDialogManager, AuthSvc: MockedAuthSvc, AccountSvc: MockedAccountSvc, GlobalData: GlobalData, CouponSvc: CouponSvc, UserCoupon: UserCoupon});
            addressDef.resolve(returnAddress);

            $scope.$apply();
            expect(MockedAccountSvc.getAddresses).toHaveBeenCalled();
            expect($scope.order.billTo.contactName).toEqualData(returnAddress.contactName);
            expect($scope.order.account.email).toEqualData(returnAccount.contactEmail);
        });

        it('should populate user data on signin', function(){
            isAuthenticated = true;
            MockedAuthSvc.isAuthenticated.reset();
            MockedAuthSvc = {
                isAuthenticated: jasmine.createSpy('isAuthenticated').andReturn(isAuthenticated)
            };
            GlobalData.user.isAuthenticated = true;
            checkoutCtrl = $controller('CheckoutCtrl', {$scope: $scope, CheckoutSvc: mockedCheckoutSvc, ShippingSvc: mockedShippingSvc, CartSvc: mockedCartSvc, AuthDialogManager: AuthDialogManager, AuthSvc: MockedAuthSvc, AccountSvc: MockedAccountSvc, GlobalData: GlobalData, CouponSvc: CouponSvc, UserCoupon: UserCoupon});
            $rootScope.$broadcast('user:signedin');
            $scope.$apply();
            expect(MockedAccountSvc.account).toHaveBeenCalled();
            expect(MockedAccountSvc.getAddresses).toHaveBeenCalled();
        });

        it('should not retrieve addresses for anonymous user', function(){
            isAuthenticated = false;
            MockedAuthSvc.isAuthenticated.reset();
            MockedAccountSvc.getDefaultAddress.reset();
            MockedAccountSvc.getAddresses.reset();
            MockedAuthSvc = {
                isAuthenticated: jasmine.createSpy('isAuthenticated').andReturn(isAuthenticated)
            };
            checkoutCtrl = $controller('CheckoutCtrl', {$scope: $scope, CheckoutSvc: mockedCheckoutSvc, ShippingSvc: mockedShippingSvc, CartSvc: mockedCartSvc, AuthDialogManager: AuthDialogManager, AuthSvc: MockedAuthSvc, AccountSvc: MockedAccountSvc, GlobalData: GlobalData, CouponSvc: CouponSvc, UserCoupon: UserCoupon});

            expect(MockedAccountSvc.getDefaultAddress).not.toHaveBeenCalled();
            expect(MockedAccountSvc.getAddresses).not.toHaveBeenCalled();
        });

        it('should generate billing address name if user has account name but no addresses', function () {
            returnAddresses = [];
            addressDef = $q.defer();

            addressesDef = $q.defer();
            addressesDef.resolve(returnAddresses);
            MockedAccountSvc = {
                account: jasmine.createSpy('account').andReturn(accountDef.promise),
                getDefaultAddress: jasmine.createSpy('getDefaultAddress').andCallFake(function(){
                    return addressDef.promise
                }),
                getAddresses: jasmine.createSpy('getAddresses').andReturn(addressesDef.promise)
            };
            checkoutCtrl = $controller('CheckoutCtrl', {$scope: $scope, CheckoutSvc: mockedCheckoutSvc, ShippingSvc: mockedShippingSvc, CartSvc: mockedCartSvc, AuthDialogManager: AuthDialogManager, AuthSvc: MockedAuthSvc, AccountSvc: MockedAccountSvc, GlobalData: GlobalData, CouponSvc: CouponSvc, UserCoupon: UserCoupon});

            $scope.$digest();

            expect($scope.order.billTo.contactName).toEqualData('Mike R ODonnell');
        });

        it('should update address name', function () {
            $scope.order.account.firstName = 'Mike';
            $scope.order.account.middleName = 'R';
            $scope.order.account.lastName = 'ODonnell';
            $scope.updateAddressName();
            expect($scope.order.billTo.contactName).toEqualData('Mike R ODonnell');
        });
    });

    describe('setShipToSameAsBillTo', function () {

        it('should copy billing to shipping if true', function(){
            $scope.shipToSameAsBillTo = true;
            $scope.order.billTo = mockBillTo;
            $scope.toggleShipToSameAsBillTo();
            expect($scope.order.shipTo).toEqualData(mockBillTo);
        });

        it('should blank out ship to if false', function(){
            $scope.shipToSameAsBillTo = false;
            $scope.order.billTo = mockBillTo;
            $scope.order.shipTo = mockBillTo;
            $scope.toggleShipToSameAsBillTo();
            expect($scope.order.shipTo).toEqualData({});
        });
    });

    describe('Place Order', function () {

        beforeEach(function () {
            $scope.showPristineErrors = false;
        });

        it('should invoke CheckoutSvc create order if form valid', function(){
            $scope.placeOrder(true, formName);
            expect(mockedCheckoutSvc.checkout).toHaveBeenCalled();
        });

        it('should not place order if form invalid', function(){
            $scope.placeOrder(false, formName);
            expect(mockedCheckoutSvc.checkout).not.toHaveBeenCalled();
        });

        it('should show pristine errors if form invalid', function(){
            $scope.placeOrder(false, formName);
            expect($scope.showPristineErrors).toEqualData(true);
        });

        it('should show default error msg if form invalid', function(){
            $scope.placeOrder(false, formName);
            expect($scope.message).toEqualData('PLEASE_CORRECT_ERRORS');
        });

        it('should ensure ship to copy', function(){
            order.billTo = mockBillTo;
            $scope.shipToSameAsBillTo = true;
            $scope.placeOrder(true, formName);
            expect(order.shipTo).toEqualData(mockBillTo);
        });
    });

    describe('Stripe Error Handling', function(){
        var stripeError, errorMsg, setValidityMock;
        var fieldErrorMsg = 'PLEASE_CORRECT_ERRORS';
        var dateErrorMsg = 'INVALID_EXPIRATION_DATE';

        beforeEach(inject(function($q) {
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

            $scope.shippingCosts = [{'id':'fedex-2dayground','name':'FedEx 2Day','fee':{'amount':8.6,'currency':'USD'},'zoneId':'us','preselect':true},{'id':'ups-standard','name':'UPS Standard','fee':{'amount':8.76,'currency':'USD'},'zoneId':'us'}];

            errorMsg = 'msg';

            stripeError = {};
            stripeError.message = errorMsg;
            stripeError.code = 'number';
            stripeError.type = 'card_error';

            $scope.message = false;
        }));

        it('should edit payment on card error', function(){
            $scope.placeOrder(true, formName);
            checkoutDfd.reject({ type: ERROR_TYPES.stripe, error: stripeError });
            $scope.$digest();
        });

        it('should set error message', function(){
            stripeError.type = null;
            $scope.placeOrder(true, formName);

            checkoutDfd.reject({ type: ERROR_TYPES.stripe, error: stripeError });
            $scope.$digest();

            expect($scope.message).toEqualData('Not able to pre-validate payment at this time.');

        });


        it('should update validity on cc number error', function(){
            $scope.placeOrder(true, formName);
            expect(setValidityMock).not.toHaveBeenCalled();
            checkoutDfd.reject({ type: ERROR_TYPES.stripe, error: stripeError });
            $scope.$digest();
            expect(setValidityMock).toHaveBeenCalled();
            expect($scope.message).toEqualData(fieldErrorMsg);
        });

        it('should update validity on cvc error', function(){
            stripeError.code = 'cvc';
            $scope.placeOrder(true, formName);
            checkoutDfd.reject({ type: ERROR_TYPES.stripe, error: stripeError });
            $scope.$digest();
            expect(setValidityMock).toHaveBeenCalled();
            expect($scope.message).toEqualData(fieldErrorMsg);
        });

        it('should update validity on month error', function(){
            stripeError.code = 'month';
            $scope.placeOrder(true, formName);
            checkoutDfd.reject({ type: ERROR_TYPES.stripe, error: stripeError });
            $scope.$digest();
            expect(setValidityMock).toHaveBeenCalled();
            expect($scope.message).toEqualData(fieldErrorMsg);
            expect($scope.checkoutForm.paymentForm.expDateMsg).toEqualData(dateErrorMsg);
        });

        it('should update validity on year error', function(){
            stripeError.code = 'year';
            $scope.placeOrder(true, formName);
            checkoutDfd.reject({ type: ERROR_TYPES.stripe, error: stripeError });
            $scope.$digest();
            expect(setValidityMock).toHaveBeenCalled();
            expect($scope.message).toEqualData(fieldErrorMsg);
            expect($scope.checkoutForm.paymentForm.expDateMsg).toEqualData(dateErrorMsg);
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

    describe('cart updated event', function(){
        it(' should update cart in scope', function(){
            var newCart =  {id: 'newCartId'};
            $rootScope.$broadcast('cart:updated', {cart: newCart});
            expect($scope.cart).toEqualData(newCart);
        });
    });

    describe('select address', function(){
        it('should open the modal dialog and select the address for shipTo', function(){
            addressDef.resolve(returnAddress);
            $scope.$apply();
            $scope.openAddressDialog();

            $scope.selectAddress(returnAddress, $scope.order.shipTo);
            expect($scope.shipToSameAsBillTo).toEqualData(true);

            expect($scope.order.shipTo.contactName).toEqualData(returnAddress.contactName);
            $scope.openAddressDialog();
            $scope.closeAddressDialog();
        });

        it('should open the modal dialog and select the address for billTo', function(){
            $scope.order.shipTo = {};
            $scope.openAddressDialog();
            $scope.selectAddress(returnAddress, $scope.order.billTo);
            $scope.$apply();
            expect($scope.shipToSameAsBillTo).toEqualData(true);
            expect($scope.order.billTo.contactName).toEqualData(returnAddress.contactName);
            expect($scope.order.shipTo.contactName).toEqualData(returnAddress.contactName);
        });
    });

    describe('shipping zones', function() {
        beforeEach(function(){
            $scope.shippingCosts = [{'id':'fedex-2dayground','name':'FedEx 2Day','fee':{'amount':8.6,'currency':'USD'},'zoneId':'us','preselect':true},{'id':'ups-standard','name':'UPS Standard','fee':{'amount':8.76,'currency':'USD'},'zoneId':'us'}];
            $scope.shippingCost = {'id':'ups-standard','name':'UPS Standard','fee':{'amount':8.6,'currency':'USD'},'zoneId':'us','preselect':true};
            mockedCartSvc.recalculateCart = jasmine.createSpy('recalculateCart').andCallFake(function (){
                return cartDfd.promise;
            });
        });
        

        it('should detect if the country is ship to country', function() {
            expect($scope.isShipToCountry('US')).toBeTruthy();
            expect($scope.isShipToCountry('FR')).toBeFalsy();
        });

        it('should hide cart and payment display', function() {
            $scope.closeCartOnCheckout();
            expect($scope.displayCart).toBeFalsy();
        });

        it('should preview order', function() {
            $scope.order.shipTo = returnAddress;
            $scope.order.billTo = returnAddress;
            $scope.previewOrder(true, true);
            expect(mockedCartSvc.recalculateCart).toHaveBeenCalled();
        });

    });

});
