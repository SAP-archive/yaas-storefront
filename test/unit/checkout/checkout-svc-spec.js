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
    var ordersRoute = '/orders';
    var $scope, $rootScope, $httpBackend, mockedState, mockedCartSvc, mockedStripeJS, checkoutSvc;

    var stripeStatus = {};
    var stripeResponse = {};

    var order = {};
    var cart =  {};
    cart.items = [{'quantity':1, 'price':2.99, 'sku': '1bcd123'}];
    order.cart = cart;
    order.creditCard = {};

    var orderId = 456;

    //beforeEach(module('ds.router'));
    beforeEach(angular.mock.module('ds.checkout', function (caasProvider) {
        caasProvider.endpoint('orders', { orderId: '@orderId' }).baseUrl(orderUrl).route(ordersRoute);

    }));

    beforeEach(module('ds.checkout', function($provide) {
        mockedState = {};
        mockedState.go = jasmine.createSpy('go');

        mockedCartSvc = {};
        mockedCartSvc.emptyCart = jasmine.createSpy('removeProductFromCart');

        var response = {};
        mockedStripeJS = {};
        var createTokenStub = function(data, callback) {
            callback(stripeStatus, stripeResponse);
        };
        mockedStripeJS.createToken = createTokenStub;

        $provide.value('$state', mockedState);
        $provide.value('CartSvc', mockedCartSvc);
        $provide.value('StripeJS', mockedStripeJS);
    }));

    beforeEach(function () {
        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });

        inject(function (_$httpBackend_, _$rootScope_, _CheckoutSvc_) {
            $rootScope = _$rootScope_;
            $scope = _$rootScope_.$new();
            $httpBackend = _$httpBackend_;
            checkoutSvc = _CheckoutSvc_;
        });

        $httpBackend.whenGET(/^[A-Za-z-/]*\.html/).respond({});
    });

    describe('successful checkout', function(){

        beforeEach(function(){
            $httpBackend.expectPOST('http://myorders/orders', {'entries':[{'amount':1, 'unitPrice':2.99, 'productCode': '1bcd123'}]}).respond({'id': 456});
        });

        it('should issue POST', function () {
            checkoutSvc.checkout(order, function(){});
            $httpBackend.flush();
        });

        it('should transition to CONFIRMATION', function () {
            checkoutSvc.checkout(order, function(){});
            $httpBackend.flush();
            expect(mockedState.go).toHaveBeenCalledWith('base.confirmation');
        });

        // TEMP ONLY TILL CHECKOUT SERVICE DOES IT FOR US
        it('should remove products from the cart after placing order', function() {
            checkoutSvc.checkout(order, function(){});
            $httpBackend.flush();
            expect(mockedCartSvc.emptyCart).toHaveBeenCalled();
        });
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



});
