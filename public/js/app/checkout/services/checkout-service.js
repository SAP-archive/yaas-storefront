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
    .factory('CheckoutSvc', ['caas', '$rootScope', '$timeout', '$state', 'StripeJS', 'CartSvc', function (caas, $rootScope, $timeout, $state, StripeJS, CartSvc) {

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

            setLastOrderId: function (id) {
                this.lastOrderId = id;
            },
            getLastOrderId: function () {
                return this.lastOrderId;
            },

            checkout: function (order, onFailure) {
                var creditCard = order.creditCard;
                var stripeData = {};
                /* jshint ignore:start */
                stripeData.number = creditCard.number;
                stripeData.exp_month = creditCard.expMonth;
                stripeData.exp_year = creditCard.expYear;
                stripeData.cvc = creditCard.cvc;
                /* jshint ignore:end */

                var self = this;
                StripeJS.createToken(stripeData, function (status, response) {
                    //console.log(response);
                    if (response.error) {
                        onFailure(response.error.message);
                    } else {
                        self.createOrder(order.cart, onFailure);
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
                    this.entries = [];
                };

                var newOrder = new Order();

                angular.forEach(cart.items, function (item) {
                    newOrder.entries.push(new OrderLine(item.quantity, item.price, item.sku));
                });


                caas.orders.API.save(newOrder).$promise.then(function (order) {
                    this.setLastOrderId(order.id);

                    // TEMP ONLY TILL CAAS CHECKOUT SVC FULLY IMPLEMENTED
                    CartSvc.emptyCart();

                    $state.go('base.confirmation');

                    // TODO - handle all error states:
                    // - HTTP response failure
                    // - call never goes through
                }, onFailure);
            }




        };

    }]);
