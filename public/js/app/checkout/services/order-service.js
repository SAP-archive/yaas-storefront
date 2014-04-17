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
    .factory('OrderSvc', ['caas', function(caas){

        return {
            /**
             * Issues a query request on the product resource.
             * @param {parms} query parameters - optional
             * @return The result array as returned by Angular $resource.query().
             */
            createOrder: function(order) {
                order.id = caas.orders.API.save(order);

            }
        }

    }]);
