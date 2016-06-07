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

angular.module('ds.checkout')
     /** The checkout service provides functions to pre-validate the credit card through Stripe,
      * and to create an order.
      */
    .factory('ShippingSvc', ['ShippingREST', '$q', 'GlobalData',
        function (ShippingREST, $q, GlobalData) {

            var getShipToCountries = function (zones) {
                var shipToCountries = [];
                for (var i = 0; i < zones.length; i++) {
                    for (var j = 0; j < zones[i].shipTo.length; j++) {
                        if (shipToCountries.indexOf(zones[i].shipTo[j]) < 0) {
                            shipToCountries.push(zones[i].shipTo[j]);
                        }
                    }
                }
                return shipToCountries;
            };

            var getSiteShippingZones = function () {
                var deferred = $q.defer();
                var shippingZones;
                var site = GlobalData.getSiteCode();
                ShippingREST.ShippingZones.all(site).all('zones').getList({ expand: 'methods,fees', activeMethods: true}).then(function(zones){
                    shippingZones = zones.length ? zones.plain() : [];
                    deferred.resolve(shippingZones);
                });

                return deferred.promise;
            };

            var getMinimumShippingCost = function (costs) {
                var zoneId;
                var minObject = {};
                var minValue;
                for (var i = 0; i < costs.length; i++) {
                    zoneId = costs[i].zone.id;
                    for (var j = 0; j < costs[i].methods.length; j++) {
                        if (!minValue || costs[i].methods[j].fee.amount < minValue) {
                            minValue = costs[i].methods[j].fee.amount;
                            minObject = {
                                fee: costs[i].methods[j].fee,
                                id: costs[i].methods[j].id,
                                name: costs[i].methods[j].name,
                                zoneId: zoneId
                            };
                        }
                    }
                }
                return minObject;
            };

            var getShippingCosts = function (item) {
                var deferred = $q.defer();
                var site = GlobalData.getSiteCode();
                var shippingCosts;
                ShippingREST.ShippingZones.one(site).all('quote').post(item).then(function(result){
                    shippingCosts = result.plain();
                    deferred.resolve(shippingCosts);
                });

                return deferred.promise;
            };

            var isShippingConfigured = function (zones) {
                if (zones) {
                    for (var i = 0; i < zones.length; i++) {
                        if (zones[i].methods && zones[i].methods.length) {
                            return true;
                        }
                    }
                }
                return false;
            };

        return {

            getShipToCountries: function (zones) {
                return getShipToCountries(zones);
            },

            getSiteShippingZones: function () {
                return getSiteShippingZones();
            },

            getShippingCosts: function (item) {
                return getShippingCosts(item);
            },

            getMinimumShippingCost: function (item) {
                return getMinimumShippingCost(item);
            },

            isShippingConfigured: function (zones) {
                return isShippingConfigured(zones);
            }

        };

    }]);
