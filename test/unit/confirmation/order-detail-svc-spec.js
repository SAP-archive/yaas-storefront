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


    var ordersUrl = 'http://order-v2.test.cf.hybris.com/orders';
    var $scope, $rootScope, $httpBackend, orderDetailSvc;

    var orderDetails = {};
    var shippingAddress = {};
    shippingAddress.companyName = 'Acme, Inc.';
    shippingAddress.street = '1 Marienplatz a';
    shippingAddress.zipCode = '80538';
    shippingAddress.city = 'Munich';
    shippingAddress.country = 'Germany';
    shippingAddress.state = 'Bavaria';
    orderDetails.shippingAddress = shippingAddress;
    orderDetails.customer = {
        name: 'Example Buyer',
        email: 'your.name@email.com'
    };
    orderDetails.entries = [];

    beforeEach(function() {
        module('restangular');
        module('ds.confirmation');
    });


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


    it('getFormattedConfirmationDetails returns order details', function () {
        var orderId = 123;
        $httpBackend.expectGET(ordersUrl + '/' + orderId).respond(orderDetails);

        var details = orderDetailSvc.getFormattedConfirmationDetails(orderId);

        $httpBackend.flush();
        expect(details.companyName).toEqualData(orderDetails.companyName);
        expect(details.street).toEqualData(orderDetails.street);
        expect(details.zipCode).toEqualData(orderDetails.zipCode);
        expect(details.city).toEqualData(orderDetails.city);
        expect(details.country).toEqualData(orderDetails.country);
        expect(details.state).toEqualData(orderDetails.state);
    });


    it('should format order detail info correctly', function () {
        var orderId = 123;
        $httpBackend.expectGET(ordersUrl+'/'+orderId).respond(orderDetails);

        var result = null;
        orderDetailSvc.getFormattedConfirmationDetails(orderId).then(function(details){
            result = details;
        });
        $httpBackend.flush();
        expect(result).toEqualData({shippingAddressLine1: 'Acme, Inc.', shippingAddressLine2: '1 Marienplatz a',
            shippingAddressLine3: 'Munich, Bavaria 80538', emailAddress : 'your.name@email.com', entries: [] });

    });
});
