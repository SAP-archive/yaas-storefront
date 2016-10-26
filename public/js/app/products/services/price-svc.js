/*
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

angular.module('ds.products')
    .factory('PriceSvc', ['PricesREST', '$q', function (PricesREST, $q) {

        var getPrices = function (parms) {
            return PricesREST.Prices.all('prices').customGET('', parms);
        };

        return {

            getPrices: getPrices,

            query: function (parms) {
                return getPrices(parms);
            },

            getPricesForProducts: function (products, currency) {
                var query = {};
                var productsIds = [];
                var productsWithVariatsIds = [];
                var promises = [];
                var prices = [];
                angular.forEach(products, function (product) {
                    productsIds.push(product.id);
                    if (product.hasVariants) {
                        productsWithVariatsIds.push(product.id);
                    }
                });

                var effectiveDate = new Date().toISOString();
                query = {
                    currency: currency,
                    productId: productsIds.join(),
                    effectiveDate: effectiveDate
                };
                promises.push(
                    this.getPrices(query)
                        .then(function assignProductsPrices(requestedPrices) {
                            angular.forEach(requestedPrices, function (requestedPrice) {
                                prices.push(requestedPrice);
                            });
                        })
                );

                angular.forEach(productsWithVariatsIds, function (productVariatId) {
                    query = {
                        currency: currency,
                        group: productVariatId,
                        effectiveDate: effectiveDate
                    };
                    promises.push(
                        this.getPrices(query)
                            .then(function assignVariantsPrices(requestedPrices) {
                                angular.forEach(requestedPrices, function (requestedPrice) {
                                    prices.push(requestedPrice);
                                });
                            })
                    );
                }, this);
                return $q.all(promises).then(function () {
                    return prices;
                });
            },

            getPricesMapForProducts: function (products, currency) {
                return this.getPricesForProducts(products, currency).then(function processPrices(prices) {
                    var pricesMap = {};
                    var favourDiscount = function (current, compare) {
                        var currentDiscount = current.originalAmount - current.effectiveAmount;
                        var compareDiscount = compare.originalAmount - compare.effectiveAmount;
                        if (currentDiscount > compareDiscount) {
                            return current;
                        } else {
                            return compare;
                        }
                    };
                    var getMinPrice = function (current, compare) {
                        if (current) {
                            if (current.effectiveAmount < compare.effectiveAmount) {
                                return current;
                            } else if (current.effectiveAmount === compare.effectiveAmount) {
                                return favourDiscount(current, compare);
                            }
                        }
                        return compare;
                    };
                    var getMaxPrice = function (current, compare) {
                        if (current) {
                            if (current.effectiveAmount > compare.effectiveAmount) {
                                return current;
                            } else if (current.effectiveAmount === compare.effectiveAmount) {
                                return favourDiscount(current, compare);
                            }
                        }
                        return compare;
                    };
                    angular.forEach(prices, function (iPrice) {
                        var price;
                        if (iPrice.productId) { // Product
                            if (!pricesMap[iPrice.productId]) {
                                pricesMap[iPrice.productId] = {
                                    singlePrice: null,
                                    minPrice: null,
                                    maxPrice: null
                                };
                            }
                            price = pricesMap[iPrice.productId];
                            price.singlePrice = iPrice;
                        } else if (iPrice.group) { // Product with variants
                            if (!pricesMap[iPrice.group]) {
                                pricesMap[iPrice.group] = {
                                    singlePrice: null,
                                    minPrice: null,
                                    maxPrice: null
                                };
                            }
                            price = pricesMap[iPrice.group];
                            if (!price.variants) {
                                price.variants = {};
                            }
                            price.variants[iPrice.itemYrn] = angular.copy(iPrice);
                            price.minPrice = getMinPrice(price.minPrice, iPrice);
                            price.maxPrice = getMaxPrice(price.maxPrice, iPrice);
                        }
                    });
                    return pricesMap;
                });
            }

        };

    }]);