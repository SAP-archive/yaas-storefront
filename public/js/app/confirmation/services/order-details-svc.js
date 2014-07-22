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
    .factory('OrderDetailSvc', ['OrderRest',  function(OrderRest){

        var getOrderDetails = function (orderId) {
            return OrderRest.one('orders', orderId).get();
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
                            // TODO: after Wombats return correct images.urls (including tenant), then the following order of looking for an image should be applied:
                            // 1. take first image from product.images[0]
                            // 2. if it doesnt exist, take the first image from product.externalImages[0]
                            var imageUrl = orderDetails.entries[i].product.externalImages[0].url;
                            if (!imageUrl) {
                                // if still nothing is found, then some dummy placeholder image? i dont know...
                            }
                            confirmationDetails.products[i] = {
                                image: imageUrl,
                                name: orderDetails.entries[i].product.name
                            };
                        }
                    }

                    window.scrollTo(0, 0);

                    return confirmationDetails;
                });

            }
        };
    }]);