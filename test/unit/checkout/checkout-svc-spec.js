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
describe('CheckoutSvc Test', function () {

    var checkoutUrl = 'http://checkout';
    var checkoutRoute = '/checkouts/order';
    var fullCheckoutPath = checkoutUrl+checkoutRoute;

    var $scope, $rootScope, $httpBackend, mockedState, mockedCartSvc, mockedStripeJS, checkoutSvc;

    var order = {};

    order.billTo = {
        firstName: 'Bob',
        lastName: 'Smith',
        address1: 'Bill Str. 14',
        city:    'Amarillo',
        state:  'TX',
        zip: '79109',
        country: 'USA',
        email: 'bs@sushi.com'
    };

    order.shipTo = {
        firstName: 'Amy',
        lastName: 'Willis',
        address1: 'Ship Lane 56',
        city: 'Arvada',
        state: 'CO',
        country: 'USA',
        zip: '80005'
    };

    order.creditCard = {};
    order.shippingCost = 4.5;

    var cart =  {};
    cart.id = 'abcCart'
    cart.subtotal = 2.99;
    cart.estTax = 0.3;
    var totalPrice = {};
    totalPrice.price = 7.79;
    cart.totalPrice = totalPrice;
    order.cart = cart;


    var checkoutJson =  {"cartId":"abcCart","currency":"USD","orderTotal":7.79,
        "addresses":[
            {"contactName":"Bob Smith","street":"Bill Str. 14","city":"Amarillo","state":"TX","zipCode":"79109",
                "country":"USA","account":"bs@sushi.com","type":"BILLING"},
            {"contactName":"Amy Willis","street":"Ship Lane 56","city":"Arvada","state":"CO","zipCode":"80005",
                "country":"USA","type":"SHIPPING"}],
        "customer":{"name":"Bob Smith","email":"bs@sushi.com"}}

    mockedStripeJS = {};
    mockedCartSvc = {};
    mockedState = {};


    var orderId = 456;

    beforeEach(function(){
        mockedCartSvc.emptyCart = jasmine.createSpy('emptyCart');
        mockedState.go = jasmine.createSpy('go');

        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });
    });

    describe('checkout with successful payment', function(){
        var stripeResponse = {};
        var stripeStatus = {};

        beforeEach(module('ds.checkout', function($provide, caasProvider) {

            mockedStripeJS.createToken = function(data, callback) {
                callback(stripeStatus, stripeResponse);
            };

            $provide.value('$state', mockedState);
            $provide.value('CartSvc', mockedCartSvc);
            $provide.value('StripeJS', mockedStripeJS);

            caasProvider.endpoint('checkout').baseUrl(checkoutUrl).route(checkoutRoute);
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

        describe('getDefaultOrder', function(){
            it('should create order with credit card', function(){
                var order = checkoutSvc.getDefaultOrder();
                expect(order.shipTo).toBeTruthy();
                expect(order.billTo).toBeTruthy();
                expect(order.billTo.country).toEqualData('USA');
                expect(order.paymentMethod).toEqualData('creditCard');
                expect(order.creditCard).toBeTruthy();
            });
        });

        describe('successful order POST', function () {
            beforeEach(function(){
                $httpBackend.expectPOST(fullCheckoutPath, checkoutJson).respond({"orderId":"456"});
            });


            it('should issue POST', function () {
                checkoutSvc.checkout(order, function(){},function(){});
                $httpBackend.flush();
            });

            it('should transition to CONFIRMATION', function () {
                checkoutSvc.checkout(order, function (){},function(){});
                $httpBackend.flush();
                expect(mockedState.go).toHaveBeenCalledWith('base.confirmation', { orderId : '456' });
            });

            // TEMP ONLY TILL CHECKOUT SERVICE DOES IT FOR US
            it('should remove products from the cart after placing order', function () {
                checkoutSvc.checkout(order, function(){},function(){});
                $httpBackend.flush();
                expect(mockedCartSvc.emptyCart).toHaveBeenCalled();
            });

        })

        describe('and failing order placement', function(){

            it('should invoke error handler', function(){
                var callbackObj = {};
                callbackObj.onFailure = jasmine.createSpy('onFailure');
                $httpBackend.expectPOST(fullCheckoutPath, checkoutJson).respond(500, '');
                checkoutSvc.checkout(order, function(){}, callbackObj.onFailure);
                $httpBackend.flush();
                var error500 = 'Cannot process this order because the system is unavailable. Try again at a later time.';
                expect(callbackObj.onFailure).toHaveBeenCalledWith(error500);

                // all other errors should be handled, as well
                $httpBackend.expectPOST(fullCheckoutPath, checkoutJson).respond(404, '');
                checkoutSvc.checkout(order, function(){}, callbackObj.onFailure);
                $httpBackend.flush();
                expect(callbackObj.onFailure).toHaveBeenCalled();
            });

            it('should not transition to CONFIRMATION', function(){
                $httpBackend.expectPOST(fullCheckoutPath, checkoutJson).respond(500, '');
                checkoutSvc.checkout(order, function(){}, function () {});
                $httpBackend.flush();
                expect(mockedState.go).not.toHaveBeenCalled();
            });
        });

    });

    describe('failing Stripe token gen', function(){
        var stripeStatus = {};
        var stripeResponse = {};
        stripeResponse.error = {};
        stripeResponse.error.message = 'Failure';

        beforeEach(module('ds.checkout', function($provide, caasProvider) {

            caasProvider.endpoint('orders').baseUrl(checkoutUrl).route(checkoutRoute);

            var createTokenStub = function(data, callback) {
                callback(stripeStatus, stripeResponse);
            };
            mockedStripeJS.createToken = createTokenStub;

            $provide.value('$state', mockedState);
            $provide.value('CartSvc', mockedCartSvc);
            $provide.value('StripeJS', mockedStripeJS);
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
             checkoutSvc.checkout(order, function(){},function(){});
             $httpBackend.verifyNoOutstandingRequest();
        });

        it('should invoke error handler', function(){
            var callbackObj = {};
            callbackObj.onFailure = jasmine.createSpy('onFailure');
            checkoutSvc.checkout(order, callbackObj.onFailure, function(){});
            expect(callbackObj.onFailure).toHaveBeenCalledWith( { message : 'Failure' } );
        });
    });

});
