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
describe('OrderSvc Test', function () {

    var orderUrl = 'http://myorders';
    var ordersRoute = '/orders';
    var $scope, $rootScope, $httpBackend, $state, orderSvc;

    var cart =  [{'quantity':1, 'price':2.99, 'sku': '1bcd123'}];

    var orderId = 456;

    beforeEach(angular.mock.module('ds.checkout', function (caasProvider) {
        caasProvider.endpoint('orders', { orderId: '@orderId' }).baseUrl(orderUrl).route(ordersRoute);
    }));


    beforeEach(function () {
        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });

        inject(function (_$httpBackend_, _$rootScope_, _$state_, _OrderSvc_) {
            $rootScope = _$rootScope_;
            $scope = _$rootScope_.$new();
            $httpBackend = _$httpBackend_;
            orderSvc = _OrderSvc_;
            $state = _$state_;

        });
    });


    xit('createOrder issues POST', function () {
        $httpBackend.expectPOST('http://myorders/orders', {'entries':[{'amount':1, 'unitPrice':2.99, 'productCode': '1bcd123'}]}).respond({'id': 456});
        orderSvc.createOrder(cart);
        $httpBackend.flush();

    });


});
