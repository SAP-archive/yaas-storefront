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
    .factory('OrderSvc',  ['caas', '$rootScope', '$timeout', '$state', function(caas, $rootScope, $timeout, $state){

        return {

            setLastOrderId: function(id){
                this.lastOrderId = id;
            },
            getLastOrderId: function() {
                return this.lastOrderId;
            },

            /**
             * Issues a Orders 'save' (POST) on the order resource.
             * Uses the CartSvc to retrieve the current set of line items.
             * @return The result array as returned by Angular $resource.query().
             */
            createOrder: function(cartItems) {

                var OrderLine = function(amount, unitPrice, productCode) {
                    this.amount = amount;
                    this.unitPrice = unitPrice;
                    this.productCode = productCode;
                };

                var Order = function(){
                    this.entries = [];
                    this.customer = 'customer account reference';
                    this.billingAddress = 'billing Address reference';
                    this.shippingAddress = 'shipping Address reference';
                };

                var newOrder = new Order();

                angular.forEach(cartItems, function(item){
                     newOrder.entries.push(new OrderLine(item.quantity, item.price, item.sku));
                });

                var self = this;
                caas.orders.API.save(newOrder).$promise.then(function(order){
                   self.setLastOrderId(order.id);
                    $state.go('base.confirmation');
                });

            }
        };

    }]);
