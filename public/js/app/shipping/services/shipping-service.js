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

            var getShipToCountries = function () {
                var deferred = $q.defer();
                var shippingZones;
                var site = GlobalData.getSiteCode();
                var shipToCountries = [];
                ShippingREST.ShippingZones.all(site).all('zones').getList().then(function(zones){
                    shippingZones = zones.length ? zones.plain() : [];
                    for (var i = 0; i < shippingZones.length; i++) {
                        for (var j = 0; j < shippingZones[i].shipTo.length; j++) {
                            shipToCountries.push(shippingZones[i].shipTo[j]);
                        }
                    }
                    deferred.resolve(shipToCountries);
                });
                
                return deferred.promise;
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

            var getMinimumShippingCost = function (item) {
                var deferred = $q.defer();
                var site = GlobalData.getSiteCode();
                var minCost;
                ShippingREST.ShippingZones.one(site).one('quote').all('minimum').post(item).then(function(result){
                    minCost = result.plain();
                    deferred.resolve(minCost);
                });

                return deferred.promise;
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

        return {

            getShipToCountries: function () {
                return getShipToCountries();
            },

            getSiteShippingZones: function () {
                return getSiteShippingZones();
            },

            getShippingCosts: function (item) {
                return getShippingCosts(item);
            },

            getMinimumShippingCost: function (item) {
                return getMinimumShippingCost(item);
            }

        };

    }]);
