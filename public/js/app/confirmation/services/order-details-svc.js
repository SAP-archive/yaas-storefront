/**
 * [y] hybris Platform
 *
 * Copyright (c) 2000-2015 hybris AG
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of hybris
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with hybris.
 */

'use strict';

/**
 *  Encapsulates access to the "order" service.
 */
angular.module('ds.confirmation')
    .factory('OrderDetailSvc', ['OrderREST', '$q', function (OrderREST, $q) {

        /** Issues a GET request for the 'order' resource
         * @param orderId
         */
        var getOrderDetails = function (orderId) {
            return OrderREST.Orders.one('orders', orderId).get();
        };

        return {

            /** Retrieves order confirmation details and formats them the spec required by the UI.
             * @param orderId
             */
            getFormattedConfirmationDetails: function (orderId) {
                return getOrderDetails(orderId).then(function (orderDetails) {

                    var confirmationDetails = {};

                    if (orderDetails.shippingAddress.contactName) {
                        confirmationDetails.shippingAddressName = orderDetails.shippingAddress.contactName;
                    }

                    if (orderDetails.shippingAddress.companyName) {
                        confirmationDetails.shippingAddressCompanyName = orderDetails.shippingAddress.companyName;
                    }

                    if (orderDetails.shippingAddress.street) {
                        confirmationDetails.shippingAddressStreetLine1 = orderDetails.shippingAddress.street;
                    }

                    if (orderDetails.shippingAddress.streetAppendix) {
                        confirmationDetails.shippingAddressStreetLine2 = orderDetails.shippingAddress.streetAppendix;
                    }

                    if (orderDetails.shipping) {
                        confirmationDetails.shipping = orderDetails.shipping;
                    }

                    if (orderDetails.subTotalPrice) {
                        confirmationDetails.subTotalPrice = orderDetails.subTotalPrice;
                    }

                    if (orderDetails.tax) {
                        confirmationDetails.tax = orderDetails.tax;
                    }

                    if (orderDetails.totalPrice) {
                        confirmationDetails.totalPrice = orderDetails.totalPrice;
                    }
                    if (orderDetails.discounts && orderDetails.discounts.length) {
                        confirmationDetails.discountAmount = orderDetails.discounts[0].amount;
                    } else {
                        confirmationDetails.discountAmount = 0;
                    }

                    confirmationDetails.shippingAddressCityStateZip = orderDetails.shippingAddress.city + ', ' + orderDetails.shippingAddress.state +
                        ' ' + orderDetails.shippingAddress.zipCode;

                    confirmationDetails.shippingAddressCountry = orderDetails.shippingAddress.country;

                    confirmationDetails.emailAddress = orderDetails.customer.email;

                    confirmationDetails.entries = orderDetails.entries;

                    confirmationDetails.currency = orderDetails.currency;

                    return confirmationDetails;
                });

            },

            cancelOrder: function (orderId) {
                var deferred = $q.defer();
                OrderREST.Orders.one('orders', orderId).all('transitions').post({status: 'DECLINED'}).then(
                    function () {
                        deferred.resolve({status: 'DECLINED'});
                    },
                    function () {
                        deferred.reject();
                    });
                return deferred.promise;
            }

        };
    }]);