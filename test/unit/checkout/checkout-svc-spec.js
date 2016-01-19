/**
 * [y] hybris Platform
 *
 * Copyright (c) 2000-2014 hybris AG
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of hybris
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with hybris.
 */
describe('CheckoutSvc', function () {

    var $scope, $rootScope, $httpBackend, $q, mockedCartSvc, mockedStripeJS, mockedGlobalData, checkoutSvc, checkoutOrderUrl, shippingCostUrl;

    var order = {};

    mockedGlobalData = {
        user: {
            isAuthenticated: '',
            user: null
        },
        getCurrencyId: jasmine.createSpy().andReturn('USD'),
        getCurrencySymbol: jasmine.createSpy().andReturn('$'),
        getAcceptLanguages: jasmine.createSpy().andReturn('en')
    };

    order.account = {
        title: 'Mr.',
        firstName: 'Michael',
        middleName: 'Jeffrey',
        lastName: 'Jordan',
        email: 'bs@sushi.com'
    };

    order.billTo = {
        contactName: 'Bob Smith',
        address1: 'Bill Str. 14',
        city:    'Amarillo',
        state:  'TX',
        zipCode: '79109',
        country: 'US'
    };

    order.shipTo = {
        contactName: 'Amy Willis',
        address1: 'Ship Lane 56',
        city: 'Arvada',
        state: 'CO',
        country: 'US',
        zipCode: '80005'
    };

    order.payment = {
        paymentId: '',
        customAttributes: {}
    };

    order.shipping = {
        'id': 'ups-standard',
        'name': 'UPS Standard',
        'zoneId': 'us',
        'fee': {
            'amount': 8.76,
            'currency': 'USD'
        }
    };

    order.creditCard = {};

    order.shippingCost = 4.5;

    var cart =  {};
    cart.id = 'abcCart';
    cart.subtotal = 2.99;
    cart.estTax = 0.3;
    var totalPrice = {};
    totalPrice.amount = 7.79;
    cart.totalPrice = totalPrice;
    cart.currency = 'USD';
    order.cart = cart;


    var checkoutJson =  {"cartId":"abcCart","currency":"USD", "payment": {"paymentId": '', "customAttributes": {}},
        "addresses":[
            {"contactName":"Bob Smith","street":"Bill Str. 14","city":"Amarillo","state":"TX","zipCode":"79109",
                "country":"US","account":"bs@sushi.com","type":"BILLING"},
            {"contactName":"Amy Willis","street":"Ship Lane 56","city":"Arvada","state":"CO","zipCode":"80005",
                "country":"US","account":"bs@sushi.com","type":"SHIPPING"}],
        "customer":{"title":"Mr.", "firstName":"Michael", "middleName":"Jeffrey", "lastName":"Jordan","email":"bs@sushi.com"},
        "totalPrice":7.79, "shipping":{"methodId":"ups-standard","amount":8.76}};

    mockedStripeJS = {};
    mockedCartSvc = {};

    beforeEach(module('ds.shared', function($provide) {
        $provide.value('appConfig', {});
    }));

    beforeEach(function(){
        mockedCartSvc.resetCart = jasmine.createSpy('resetCart');

        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });
    });

    describe('checkout with successful payment', function(){
        var stripeResponse = {};
        var stripeStatus = {};

        beforeEach(function() {
            module('restangular');
            module('ds.checkout');
        });

        beforeEach(module('ds.checkout', function($provide) {

            mockedStripeJS.createToken = function(data, callback) {
                callback(stripeStatus, stripeResponse);
            };
            $provide.value('CartSvc', mockedCartSvc);
            $provide.value('StripeJS', mockedStripeJS);
            $provide.value('GlobalData', mockedGlobalData);
        }));

        beforeEach(function () {

            inject(function (_$httpBackend_, _$rootScope_, _CheckoutSvc_, _$q_, SiteConfigSvc) {
                $rootScope = _$rootScope_;
                $scope = _$rootScope_.$new();
                $httpBackend = _$httpBackend_;
                checkoutSvc = _CheckoutSvc_;
                siteConfig = SiteConfigSvc;
                checkoutOrderUrl = siteConfig.apis.checkout.baseUrl + 'checkouts/order';
                shippingCostUrl = siteConfig.apis.shippingCosts.baseUrl + 'shippingcosts';
                $q = _$q_;
            });

            $httpBackend.whenGET(/^[A-Za-z-/]*\.html/).respond({});
        });

        describe('getDefaultOrder', function(){
            it('should create order with credit card', function(){
                var order = checkoutSvc.getDefaultOrder();
                expect(order.shipTo).toBeTruthy();
                expect(order.billTo).toBeTruthy();
                expect(order.billTo.country).toEqualData('US');
                expect(order.payment.paymentId).toEqualData('stripe');
                expect(order.creditCard).toBeTruthy();
            });
        });

        describe('and successful order placement', function () {

            beforeEach(function(){
                $httpBackend.expectPOST(checkoutOrderUrl, checkoutJson, function(headers){
                    return headers['accept-language'] == 'en';
                }).respond({"orderId":"456"});
            });

            it('should issue POST', function () {
                checkoutSvc.checkout(order);
                $httpBackend.flush();
            });

            it('should remove products from the cart after placing order', function () {
                checkoutSvc.checkout(order);
                $httpBackend.flush();
                $rootScope.$digest();
                checkoutSvc.resetCart();
                expect(mockedCartSvc.resetCart).toHaveBeenCalled();
            });

        });

        describe('and order placement failing due to HTTP 500', function(){
            beforeEach(function(){
                $httpBackend.expectPOST(checkoutOrderUrl, checkoutJson).respond(500, '');
            });

            it('should display System Unavailable', function(){
                var
                    onSuccessSpy = jasmine.createSpy('success'),
                    onErrorSpy = jasmine.createSpy('error'),
                    error500msg = 'Cannot process this order because the system is unavailable. Try again at a later time.';

                checkoutSvc.checkout(order).then(onSuccessSpy, onErrorSpy);
                $httpBackend.flush();
                $rootScope.$digest();

                expect(onSuccessSpy).not.toHaveBeenCalled();
                expect(onErrorSpy).toHaveBeenCalledWith({ type: checkoutSvc.ERROR_TYPES.order, error: error500msg });
            });
        });

        describe('and order placement due to other error', function(){
            beforeEach(function(){
                $httpBackend.expectPOST(checkoutOrderUrl, checkoutJson).respond(400, '');
            });

            it('should display System Unavailable', function(){
                var
                    onSuccessSpy = jasmine.createSpy('success'),
                    onErrorSpy = jasmine.createSpy('error'),
                    error400msg = 'Order could not be processed. Status code: 400.';

                checkoutSvc.checkout(order).then(onSuccessSpy, onErrorSpy);
                $httpBackend.flush();
                $rootScope.$digest();

                expect(onSuccessSpy).not.toHaveBeenCalled();
                expect(onErrorSpy).toHaveBeenCalledWith({ type: checkoutSvc.ERROR_TYPES.order, error: error400msg });
            });

        });

    });

    describe('failing Stripe token gen', function(){
        var stripeStatus = {};
        var stripeResponse = {};
        var errorMessage = 'Failure';
        stripeResponse.error = {};
        stripeResponse.error.message = errorMessage;

        beforeEach(function() {
            module('restangular');
        });

        beforeEach(module('ds.checkout', function($provide) {
            var createTokenStub = function(data, callback) {
                callback(stripeStatus, stripeResponse);
            };
            mockedStripeJS.createToken = createTokenStub;

            $provide.value('CartSvc', mockedCartSvc);
            $provide.value('StripeJS', mockedStripeJS);
            $provide.value('GlobalData', mockedGlobalData);
        }));

        beforeEach(function () {
            inject(function (_$httpBackend_, _$rootScope_, _CheckoutSvc_) {
                $rootScope = _$rootScope_;
                $scope = _$rootScope_.$new();
                $httpBackend = _$httpBackend_;
                checkoutSvc = _CheckoutSvc_;
            });

            $httpBackend.whenGET(/^[A-Za-z-/]*\.html/).respond({});
        });


        it('should not place order', function(){
             checkoutSvc.checkout(order);
             $httpBackend.verifyNoOutstandingRequest();
        });

        it('should invoke error handler', function(){
            var onSuccessSpy = jasmine.createSpy('success'),
                onErrorSpy = jasmine.createSpy('error');

            checkoutSvc.checkout(order).then(onSuccessSpy, onErrorSpy);
            $rootScope.$digest();

            expect(onSuccessSpy).not.toHaveBeenCalled();
            expect(onErrorSpy).toHaveBeenCalledWith({ type: checkoutSvc.ERROR_TYPES.stripe, error: stripeResponse.error });
        });

    });

    describe('getShippingCost', function(){

        var onSuccessSpy, onErrorSpy;

        var defaultCost = {

            "price": {
                "USD": 0
            }
        };


        beforeEach(function() {
            module('restangular');
            module('ds.checkout', function($provide){

                $provide.value('CartSvc', mockedCartSvc);
                $provide.value('StripeJS', mockedStripeJS);
                $provide.value('GlobalData', mockedGlobalData);
            });
        });

        beforeEach(function() {
            inject(function (_$httpBackend_,_CheckoutSvc_) {
                $httpBackend = _$httpBackend_;
                checkoutSvc = _CheckoutSvc_;
            });
            $httpBackend.whenGET(/^[A-Za-z-/]*\.html/).respond({});

            onSuccessSpy = jasmine.createSpy('success');
            onErrorSpy = jasmine.createSpy('error');
        });


        it('should return positive shipping cost', function(){
            var singleCost = {
                "id": "default",
                "price": {
                    "USD": 2.99
                }
            };
            var costResponse = [singleCost ];
            $httpBackend.expectGET(shippingCostUrl).respond(costResponse);
            checkoutSvc.getShippingCost().then(onSuccessSpy, onErrorSpy);

            $httpBackend.flush();
            $rootScope.$digest();
            expect(onSuccessSpy).toHaveBeenCalledWith(singleCost);
            expect(onErrorSpy).not.toHaveBeenCalled();
        });

        it('should return zero for empty array', function(){
            $httpBackend.expectGET(shippingCostUrl).respond([]);
            checkoutSvc.getShippingCost().then(onSuccessSpy, onErrorSpy);

            $httpBackend.flush();
            $rootScope.$digest();
            expect(onSuccessSpy).toHaveBeenCalledWith(defaultCost);
            expect(onErrorSpy).not.toHaveBeenCalled();
        });

        it('should return zero for missing shipping cost', function(){
            $httpBackend.expectGET(shippingCostUrl).respond([{}]);
            checkoutSvc.getShippingCost().then(onSuccessSpy, onErrorSpy);

            $httpBackend.flush();
            $rootScope.$digest();
            expect(onSuccessSpy).toHaveBeenCalledWith(defaultCost);
            expect(onErrorSpy).not.toHaveBeenCalled();
        });

        it('should invoke failure handler on error', function(){
            $httpBackend.expectGET(shippingCostUrl).respond(500,'');
            checkoutSvc.getShippingCost().then(onSuccessSpy, onErrorSpy);

            $httpBackend.flush();
            $rootScope.$digest();
            expect(onSuccessSpy).not.toHaveBeenCalled();
            expect(onErrorSpy).toHaveBeenCalled();
        });
    });

});
