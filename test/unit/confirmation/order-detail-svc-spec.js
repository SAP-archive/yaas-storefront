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
describe('OrderDetailSvc Test', function () {

    var url = 'http://dummyurl';
    var route = '/details/:orderId';
    var $scope, $rootScope, $httpBackend, orderDetailSvc;

    var orderDetails = {};
    var shippingAddress = {};
    shippingAddress.companyName = 'Acme, Inc.';
    shippingAddress.street = 'Marienplatz';
    shippingAddress.streetNumber = '1';
    shippingAddress.streetAppendix = 'a';
    shippingAddress.zipCode = '80538';
    shippingAddress.city = 'Munich';
    shippingAddress.country = 'Germany';
    shippingAddress.state = 'Bavaria';
    orderDetails.shippingAddress = shippingAddress;

    beforeEach(angular.mock.module('ds.confirmation', function (caasProvider) {
        caasProvider.endpoint('orderDetails', { orderId: '@orderId' }).baseUrl(url).route(route);
    }));


    beforeEach(function () {
        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });

        inject(function (_$httpBackend_, _$rootScope_, _OrderDetailSvc_) {
            $rootScope = _$rootScope_;
            $scope = _$rootScope_.$new();

            $httpBackend = _$httpBackend_;
            orderDetailSvc = _OrderDetailSvc_;
        });
    });


    it('get returns order details', function () {
        $httpBackend.expectGET('http://dummyurl/details').respond(orderDetails);

        var details = orderDetailSvc.get();

        $httpBackend.flush();
        expect(details).toEqualData(orderDetails);
    });


    it('should format order detail info correctly', function () {
        var orderId = 123;
        $httpBackend.expectGET('http://dummyurl/details/'+orderId).respond(orderDetails);

        var result = null;
        orderDetailSvc.getFormattedConfirmationDetails(orderId).then(function(details){
            result = details;
        });
        $httpBackend.flush();
        expect(result).toEqualData({shippingAddressLine1: 'Acme, Inc.', shippingAddressLine2: '1 Marienplatz a', shippingAddressLine3: 'Munich, Bavaria 80538'});

    });
});
