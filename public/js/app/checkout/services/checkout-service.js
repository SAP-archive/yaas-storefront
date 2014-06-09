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
    .factory('CheckoutSvc', ['caas', '$rootScope', '$state', 'StripeJS', 'CartSvc',
        function (caas, $rootScope, $state, StripeJS, CartSvc) {

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
            this.shippingCost = 3; // hard-coded for now
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
                StripeJS.createToken(stripeData, function (status, response) {
                    //console.log(response);
                    if (response.error) {
                        onStripeFailure(response.error);
                    } else {
                        self.createOrder(order.cart, onOrderFailure);
                    }
                });
            },


            /**
             * Issues a Orders 'save' (POST) on the order resource.
             * Uses the CartSvc to retrieve the current set of line items.
             * @return The result array as returned by Angular $resource.query().
             */
            createOrder: function(cart, onFailure) {

                var OrderLine = function (amount, unitPrice, productCode) {
                    this.amount = amount;
                    this.unitPrice = unitPrice;
                    this.productCode = productCode;
                };

                var Order = function () {
                    this.customer = {
                        'name':'Example Buyer',
                        'email':'buyer@example.com'
                    };
                    this.entries = [];
                };

                var newOrder = new Order();

                angular.forEach(cart.items, function (item) {
                    newOrder.entries.push(new OrderLine(item.quantity, item.price, item.sku));
                });

                //will need to update shipping cost
                newOrder.totalPrice = cart.subtotal;
                if (cart.estTax) {
                    newOrder.totalPrice += cart.estTax;
                }
                if (this.getDefaultOrder().shippingCost) {
                    newOrder.totalPrice += this.getDefaultOrder().shippingCost;
                }

                caas.orders.API.save(newOrder).$promise.then(function (order) {

                    // TEMP ONLY TILL CAAS CHECKOUT SVC FULLY IMPLEMENTED
                    CartSvc.emptyCart();

                    $state.go('base.confirmation', {orderId: order.id});

                }, function(errorResponse){
                    // TODO - HANDLE SERVER-SIDE PAYMENT ISSUES
                    if(errorResponse.status === 500) {
                        onFailure('Cannot process this order because the system is unavailable. Try again at a later time.');
                    }  else {
                        onFailure('Order could not be processed.  Status code: '+errorResponse.status+', message: '+errorResponse.data );
                    }
                });
            }

        };

    }]);
