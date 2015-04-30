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

    var $scope, $rootScope, $httpBackend, orderDetailSvc, ordersUrl;

    var orderDetails = {};
    var shippingAddress = {};
    shippingAddress.companyName = 'Acme, Inc.';
    shippingAddress.street = '1 Marienplatz a';
    shippingAddress.streetAppendix = 'Apt 1';
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

    beforeEach(module('ds.shared', function($provide) {
        $provide.value('appConfig', {});
    }));

    beforeEach(function () {
        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });

        inject(function (_$httpBackend_, _$rootScope_, _OrderDetailSvc_, SiteConfigSvc) {
            $rootScope = _$rootScope_;
            $scope = _$rootScope_.$new();
            $httpBackend = _$httpBackend_;
            siteConfig = SiteConfigSvc;
            ordersUrl = siteConfig.apis.orders.baseUrl + 'orders';
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
        expect(result).toEqualData({shippingAddressCompanyName: 'Acme, Inc.', shippingAddressStreetLine1: '1 Marienplatz a',
            shippingAddressStreetLine2: 'Apt 1', discountAmount : 0, shippingAddressCityStateZip: 'Munich, Bavaria 80538',
            shippingAddressCountry: 'Germany', emailAddress: 'your.name@email.com', entries: [ ], currency : undefined});

        /*
         test with name instead of company
         */

        var orderId = 123;
        $httpBackend.expectGET(ordersUrl+'/'+orderId).respond(orderDetails);

        var result = null;
        shippingAddress.contactName = 'Michael Jordan';
        orderDetails.shippingAddress = shippingAddress;
        orderDetailSvc.getFormattedConfirmationDetails(orderId).then(function(details){
            result = details;
        });
        $httpBackend.flush();

        expect(result).toEqualData({shippingAddressName: 'Michael Jordan', shippingAddressCompanyName: 'Acme, Inc.',
            shippingAddressStreetLine1: '1 Marienplatz a', shippingAddressStreetLine2: 'Apt 1', discountAmount : 0,
            shippingAddressCityStateZip: 'Munich, Bavaria 80538', shippingAddressCountry: 'Germany',
            emailAddress: 'your.name@email.com', entries: [ ], currency : undefined});
    });
});
