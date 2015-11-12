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

angular.module('ds.orders')
    .factory('OrderListSvc', ['settings', 'GlobalData', 'OrdersREST', function(settings, GlobalData, OrdersREST){

        var getOrders = function (parms) {
            var ordersPromise = OrdersREST.Orders.all('orders').getList(parms);
            ordersPromise.then(function(response) {
                if (response.headers) {
                    GlobalData.orders.meta.total = parseInt(response.headers[settings.headers.paging.total], 10) || 0;
                }
            });
            return ordersPromise;
        };

        return {
            /**
             * Issues a query request on the order resource.
             * @param {parms} query parameters - optional
             * @return The result array as returned by Angular $resource.query().
             */
            query: function(parms) {
                return getOrders(parms);
            }

        };

    }]);
