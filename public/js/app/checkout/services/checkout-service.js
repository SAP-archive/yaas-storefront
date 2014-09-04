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

angular.module('ds.checkout')
     /** The checkout service provides functions to pre-validate the credit card through Stripe,
      * and to create an order.
      */
    .factory('CheckoutSvc', ['CheckoutREST', 'StripeJS', 'CartSvc', 'settings', '$q',
        function (CheckoutREST, StripeJS, CartSvc, settings, $q) {

        /** CreditCard object prototype */
        var CreditCard = function () {
            this.number = null;
            this.cvc = null;
            this.expMonth = null;
            this.expYear = null;
        };

        /** Order prototype for start of checkout.*/
        var DefaultOrder = function () {
            this.shipTo = {};
            this.billTo = {};
            this.billTo.country = 'USA';

            this.paymentMethod = 'creditCard';
            this.creditCard = new CreditCard();
        };

        /** Error types to distinguish between Stripe validation and order submission errors
         * during checkout. */
        var ERROR_TYPES = {
            stripe: 'STRIPE_ERROR',
            order: 'ORDER_ERROR'
        };

        return {

            ERROR_TYPES: ERROR_TYPES,

            /** Returns a blank order for a clean checkout page.*/
            getDefaultOrder: function () {
                return new DefaultOrder();
            },

            /** Performs Stripe validation of the credit card, and if successful,
             * creates a new order.
             */
            checkout: function (order) {

                // the promise handle to the result of the transaction
                var deferred = $q.defer();

                var stripeData = {};
                /* jshint ignore:start */
                var creditCard = order.creditCard;
                stripeData.number = creditCard.number;
                stripeData.exp_month = creditCard.expMonth;
                stripeData.exp_year = creditCard.expYear;
                stripeData.cvc = creditCard.cvc;
                /* jshint ignore:end */

                var self = this;
                try {

                    StripeJS.createToken(stripeData, function (status, response) {

                        if (response.error) {
                            deferred.reject({ type: ERROR_TYPES.stripe, error: response.error });
                        } else {
                            self.createOrder(order, response.id).then(
                                // success handler
                                function (order) {
                                    CartSvc.resetCart();
                                    deferred.resolve(order);
                                },
                                // error handler
                                function(errorResponse){
                                    var errMsg = '';

                                    if(errorResponse.status === 500) {
                                        errMsg = 'Cannot process this order because the system is unavailable. Try again at a later time.';
                                    } else {
                                        errMsg = 'Order could not be processed.';
                                        if(errorResponse) {
                                            if(errorResponse.status) {
                                                errMsg += ' Status code: '+errorResponse.status+'.';
                                            }
                                            if(errorResponse.message) {
                                                errMsg += ' ' + errorResponse.message;
                                            }
                                        }
                                    }
                                    deferred.reject({ type: ERROR_TYPES.order, error: errMsg });
                                }
                            );
                        }
                    });
                }
                catch (error) {
                    console.error('Exception occurred during checkout: '+JSON.stringify(error));
                    error.type = 'payment_token_error';
                    deferred.reject({ type: ERROR_TYPES.stripe, error: error });
                }
                return deferred.promise;
            },


            /**
             * Issues a Orders 'save' (POST) on the order resource.
             * Uses the CartSvc to retrieve the current set of line items.
             * @param order
             * @param validated Stripe token
             * @return The result array as returned by Angular $resource.query().
             */
            createOrder: function(order, token) {
                var Order = function () {};
                var newOrder = new Order();
                newOrder.cartId = order && order.cart && order.cart.id ? order.cart.id : null;
                newOrder.creditCardToken = token;
                newOrder.currency = 'USD';
                newOrder.shippingCost = order.shippingCost;

                newOrder.orderTotal =  order.cart.totalPrice.price;

                var name = order.billTo.firstName + ' ' + order.billTo.lastName;
                newOrder.addresses = [];
                var billTo = {};
                billTo.contactName = name;
                billTo.street = order.billTo.address1;
                // TODO - what about 2nd street line?
                billTo.city = order.billTo.city;
                billTo.state = order.billTo.state;
                billTo.zipCode = order.billTo.zip;
                billTo.country = order.billTo.country;
                billTo.account = order.billTo.email;
                billTo.type = 'BILLING';
                newOrder.addresses.push(billTo);

                var shipTo = {};
                shipTo.contactName = order.shipTo.firstName + ' '+order.shipTo.lastName;
                shipTo.street = order.shipTo.address1;
                // TODO - what about 2nd street line?
                shipTo.city = order.shipTo.city;
                shipTo.state = order.shipTo.state;
                shipTo.zipCode = order.shipTo.zip;
                shipTo.country = order.shipTo.country;
                shipTo.account = order.shipTo.email;
                shipTo.type = 'SHIPPING';
                newOrder.addresses.push(shipTo);

                newOrder.customer = {};
                newOrder.customer.name = name;
                newOrder.customer.email = order.billTo.email;

                // Will be submitted as "hybris-user" request header
                settings.hybrisUser = newOrder.customer.email;

                return CheckoutREST.Checkout.all('checkouts').all('order').post(newOrder);

            },

            /** Returns the shipping costs for this tenant.  If no cost found, it will be set to zero.
             */
            getShippingCost: function() {
                var deferred = $q.defer();

                CheckoutREST.ShippingCosts.all('shippingcosts').getList().then(function(shippingCosts){
                    var defaultCost = {};
                    defaultCost.price = {};
                    defaultCost.price.price = 0;

                    var costs = shippingCosts.length && shippingCosts[0].price ? shippingCosts[0].plain() : defaultCost;
                    deferred.resolve(costs);
                }, function(failure){
                    deferred.reject(failure);
                });

                return deferred.promise;
            }

        };

    }]);
