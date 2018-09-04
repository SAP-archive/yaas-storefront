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

/**
 *  Encapsulates access to the CAAS product API.
 */
angular.module('ds.products')
    .factory('ProductSvc', ['$http', '$q', function ($http, $q) {

        var listPromise = $http.get('products.json').then(function (response) {
            return response.data;
        });

        var pricesPromise = $http.get('prices.json').then(function (response) {
            return response.data;
        });

        return {
            queryProductList: function (query) {
                return listPromise.then(function (data) {
                    if(query && query.category){
                        return _.filter(data, function (item) {
                            return item.category.toUpperCase() === query.category.toUpperCase();
                        });
                    }
                    return data;
                });
            },
            getProductVariant: function (params) {
                return listPromise.then(function (data) {
                    return _.findWhere(data, {id: params.productId});
                });
            },
            getProductVariants: function (params) {
                return listPromise.then(function (data) {
                    return _.filter(data, function (item) {
                        return item.id === params.productId;
                    });
                });
            },
            getProduct: function (params) {
                return $q.all([listPromise, pricesPromise]).then(function (results) {
                    return {
                        product: _.findWhere(results[0], {id: params.productId}),
                        prices: _.filter(results[1], function (item) {
                            return item.productId === params.productId;
                        })
                    };
                });
            }
        };
    }]);
