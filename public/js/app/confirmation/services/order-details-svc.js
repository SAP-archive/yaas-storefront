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
 *  Encapsulates access to the "order" service.
 */
angular.module('ds.confirmation')
    .factory('OrderDetailSvc', ['OrderREST',  function(OrderREST){

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

                    confirmationDetails.products = [];
                    for (var i = 0; orderDetails.entries && i < orderDetails.entries.length; i++) {
                        if (orderDetails.entries[i].product) {
                            // The following order of looking for an image should be applied:
                            // 1. take first image from product.images[0]
                            var imageUrl = orderDetails.entries[i].product.images ? orderDetails.entries[i].product.images[0].url : null;
                            // 2. if it doesn't exist, take the first image from product.externalImages[0]
                            if(!imageUrl) {
                                imageUrl = orderDetails.entries[i].product.externalImages[0].url;
                            }
                            confirmationDetails.products[i] = {
                                image: imageUrl,
                                name: orderDetails.entries[i].product.name
                            };
                        }
                    }
                    return confirmationDetails;
                });

            }
        };
    }]);