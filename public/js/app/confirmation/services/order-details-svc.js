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

'use strict';

/**
 *  Encapsulates access to the CAAS order details API.
 */
angular.module('ds.confirmation')
    .factory('OrderDetailSvc', ['caas',  function(caas){

        var getOrderDetails = function (orderId) {
            return caas.orders.API.get({orderId: orderId });
        };

        return {
            /**
             * Issues a query request on the product resource.
             * @param {orderId} orderId
             * @return The result array as returned by Angular $resource.query().
             */
            get: function(orderId) {
                return getOrderDetails(orderId);
            },

            getFormattedConfirmationDetails: function (orderId) {

                return getOrderDetails(orderId).$promise.then(function (orderDetails) {

                    var confirmationDetails = {};

                    if (orderDetails.shippingAddress.contactName) {
                        confirmationDetails.shippingAddressLine1 = orderDetails.shippingAddress.contactName;
                    }

                    else if (orderDetails.shippingAddress.companyName) {
                        confirmationDetails.shippingAddressLine1 = orderDetails.shippingAddress.companyName;
                    }

                    if (orderDetails.shippingAddress.street) {
                        confirmationDetails.shippingAddressLine2 = orderDetails.shippingAddress.street;
                    }

                    confirmationDetails.shippingAddressLine3 = orderDetails.shippingAddress.city + ', ' + orderDetails.shippingAddress.state +
                        ' ' + orderDetails.shippingAddress.zipCode;

                    confirmationDetails.emailAddress = orderDetails.customer.email;

                    return confirmationDetails;
                });

            }
        };
    }]);