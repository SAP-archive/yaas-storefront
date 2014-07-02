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

    .factory('CheckoutSvc', ['caas', '$rootScope', '$state', 'StripeJS', 'CartSvc', 'settings',
        function (caas, $rootScope, $state, StripeJS, CartSvc, settings) {

        var CreditCard = function () {
            this.number = null;
            this.cvc = null;
            this.expMonth = null;
            this.expYear = null;
        };

        var DefaultOrder = function () {
            this.shipTo = {};
            this.billTo = {};
            this.billTo.country = 'USA';

            this.paymentMethod = 'creditCard';
            this.creditCard = new CreditCard();
        };

        return {

            getDefaultOrder: function () {
                return new DefaultOrder();
            },


            checkout: function (order, onStripeFailure, onOrderFailure) {

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
                    document.body.style.cursor = 'wait';
                    StripeJS.createToken(stripeData, function (status, response) {
                        //console.log(response);
                        document.body.style.cursor = 'auto';
                        if (response.error) {
                            onStripeFailure(response.error);
                        } else {
                            self.createOrder(order, response.id, onOrderFailure);
                        }
                    });
                }
                catch (error) {
                    error.type = 'payment_token_error';
                    onStripeFailure(error);
                }
            },


            /**
             * Issues a Orders 'save' (POST) on the order resource.
             * Uses the CartSvc to retrieve the current set of line items.
             * @return The result array as returned by Angular $resource.query().
             */
            createOrder: function(order, token, onFailure) {

                var Order = function () {

                };

                var newOrder = new Order();
                newOrder.cartId = order.cart.id;
                newOrder.creditCardToken = token;
                newOrder.currency = 'USD';

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

                caas.checkout.API.save(newOrder).$promise.then(function (order) {
                    // TODO this should be an event to be handled in the router in order to decouple various modules
                    // Cart reset should also happen as part of this event
                    $state.go('base.confirmation', {orderId: order.orderId});

                    CartSvc.resetCart();

                }, function(errorResponse){
                    // TODO - HANDLE SERVER-SIDE PAYMENT ISSUES
                    if(errorResponse.status === 500) {
                        onFailure('Cannot process this order because the system is unavailable. Try again at a later time.');
                    }  else {
                        var errMsg = 'Order could not be processed.';
                        if(errorResponse) {
                            if(errorResponse.status) {
                                errMsg +=  ' Status code: '+errorResponse.status+'.';
                            }
                            if(errorResponse.message) {
                                errMsg +=  ' ' + errorResponse.message;
                            }
                        }
                        onFailure(  errMsg );
                    }
                });
            }

        };

    }]);
