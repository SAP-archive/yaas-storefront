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

    var orderUrl = 'http://myorders';
    var orderRoute = '/orders';
    var $scope, $rootScope, $httpBackend, mockedState, mockedCartSvc, mockedStripeJS, checkoutSvc;

    var order = {};
    var cart =  {};
    mockedStripeJS = {};
    mockedCartSvc = {};
    mockedState = {};

    cart.items = [{'quantity':1, 'price':2.99, 'sku': '1bcd123'}];
    order.cart = cart;
    order.creditCard = {};


    var orderId = 456;

    beforeEach(function(){
        mockedCartSvc.emptyCart = jasmine.createSpy('emptyCart');
        mockedState.go = jasmine.createSpy('go');

        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });
    })

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

            caasProvider.endpoint('orders').baseUrl(orderUrl).route(orderRoute);
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
                expect(order.shippingCost).toBeTruthy();
                expect(order.paymentMethod).toEqualData('creditCard');
                expect(order.creditCard).toBeTruthy();
            });
        });

        describe('successful order POST', function () {
            beforeEach(function(){
                $httpBackend.expectPOST('http://myorders/orders', {'entries':[{'amount':1, 'unitPrice':2.99, 'productCode': '1bcd123'}]}).respond({'id': 456});
            });


            it('should issue POST', function () {
                checkoutSvc.checkout(order, function(){});
                $httpBackend.flush();
            });

            it('should transition to CONFIRMATION', function () {
                checkoutSvc.checkout(order, function () {
                });
                $httpBackend.flush();
                expect(mockedState.go).toHaveBeenCalledWith('base.confirmation');
            });

            // TEMP ONLY TILL CHECKOUT SERVICE DOES IT FOR US
            it('should remove products from the cart after placing order', function () {
                checkoutSvc.checkout(order, function () {
                });
                $httpBackend.flush();
                expect(mockedCartSvc.emptyCart).toHaveBeenCalled();
            });
        })

        describe('and failing order placement', function(){

            beforeEach(function(){
                $httpBackend.expectPOST('http://myorders/orders', {'entries':[{'amount':1, 'unitPrice':2.99, 'productCode': '1bcd123'}]}).respond(500, '');
            });

            it('should invoke error handler', function(){
                var callbackObj = {};
                callbackObj.onFailure = jasmine.createSpy('onFailure');
                checkoutSvc.checkout(order, callbackObj.onFailure);
                $httpBackend.flush();
                var error500 = 'Cannot process this order because the system is unavailable. Try again at a later time.';
                expect(callbackObj.onFailure).toHaveBeenCalledWith(error500);

                // all other errors should be handled, as well
                $httpBackend.expectPOST('http://myorders/orders', {'entries':[{'amount':1, 'unitPrice':2.99, 'productCode': '1bcd123'}]}).respond(404, '');
                checkoutSvc.checkout(order, callbackObj.onFailure);
                $httpBackend.flush();
                expect(callbackObj.onFailure).toHaveBeenCalled();
            });

            it('should not transition to CONFIRMATION', function(){
                checkoutSvc.checkout(order, function () {
                });
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

            caasProvider.endpoint('orders').baseUrl(orderUrl).route(orderRoute);

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
             checkoutSvc.checkout(order, function(){});
             $httpBackend.verifyNoOutstandingRequest();
        });

        it('should invoke error handler', function(){
            var callbackObj = {};
            callbackObj.onFailure = jasmine.createSpy('onFailure');
            checkoutSvc.checkout(order, callbackObj.onFailure);
            expect(callbackObj.onFailure).toHaveBeenCalledWith('Failure');
        });
    });

});
