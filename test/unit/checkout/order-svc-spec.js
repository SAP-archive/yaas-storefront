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
    var $scope, $rootScope, $httpBackend, orderSvc;

    var cart = { entries: [{'amount':1, }]};

    var orderId = 456;

    beforeEach(angular.mock.module('ds.checkout', function (caasProvider) {

        caasProvider.setBaseRoute(orderUrl);
        caasProvider.endpoint('orders', { orderId: '@orderId' }).route(ordersRoute);
    }));


    beforeEach(function () {
        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });

        inject(function (_$httpBackend_, _$rootScope_, _OrderSvc_) {
            $rootScope = _$rootScope_;
            $scope = _$rootScope_.$new();

            $httpBackend = _$httpBackend_;
            orderSvc = _OrderSvc_;
        });
    });


    it('createOrder issues POST and update last order id', function () {
        /*
        $httpBackend.expectPOST('http://myorders/orders');

        var products = orderService.query();

        $httpBackend.flush();
        expect(products).toEqualData(prodList); */
    });


});
