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
                        .then(function assignProductsPrices(savedPrices) {
                            angular.forEach(savedPrices, function (savedPrice) {
                                prices.push(savedPrice);
                            });
                        })
                );

                query = {
                    currency: currency,
                    group: productsWithVariatsIds.join(),
                    effectiveDate: effectiveDate
                };
                promises.push(
                    this.getPrices(query)
                        .then(function assignVariantsPrices(savedPrices) {
                            angular.forEach(savedPrices, function (savedPrice) {
                                prices.push(savedPrice);
                            });
                        })
                );
                return $q.all(promises).then(function () {
                    return prices;
                });
            },

            getPricesMapForProducts: function (products, currency) {
                return this.getPricesForProducts(products, currency).then(function processPrices(savedPrices) {
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
                    var getCommonMeasurementUnit = function (price, savedPrice) {
                        if (price.commonMeasurementUnit === 'NotInitialized') {
                            if (savedPrice.hasOwnProperty('measurementUnit')) {
                                return angular.copy(savedPrice.measurementUnit);
                            } else {
                                return null;
                            }
                        } else {
                            if (price.hasOwnProperty('commonMeasurementUnit') && (!savedPrice.hasOwnProperty('measurementUnit') || !angular.equals(price.commonMeasurementUnit, savedPrice.measurementUnit))) {
                                return null;
                            } else {
                                return price.commonMeasurementUnit;
                            }
                        }
                    };
                    angular.forEach(savedPrices, function (savedPrice) {
                        var price;
                        function getOrCreatePrice(productId) {
                            if (!pricesMap[productId]) {
                                pricesMap[productId] = {
                                    singlePrice: null,
                                    minPrice: null,
                                    maxPrice: null,
                                    commonMeasurementUnit: 'NotInitialized'
                                };
                            }
                            return pricesMap[productId];
                        }
                        if (savedPrice.productId) { // Price of product
                            price = getOrCreatePrice(savedPrice.productId);
                            price.singlePrice = savedPrice;
                        } else if (savedPrice.group) { // Price of variant
                            price = getOrCreatePrice(savedPrice.group);
                            price.minPrice = getMinPrice(price.minPrice, savedPrice);
                            price.maxPrice = getMaxPrice(price.maxPrice, savedPrice);
                            price.commonMeasurementUnit = getCommonMeasurementUnit(price, savedPrice);
                        }
                    });
                    return pricesMap;
                });
            }

        };

    }]);