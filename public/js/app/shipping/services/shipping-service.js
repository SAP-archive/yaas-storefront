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
                }, function(failure){
                    console.log('From error');
                    if (failure.status === 404) {
                        deferred.resolve(shipToCountries);
                    } else {
                        deferred.reject(failure);
                    }
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
                }, function(failure){
                    console.log('From error');
                    if (failure.status === 404) {
                        deferred.resolve(shippingZones);
                    } else {
                        deferred.reject(failure);
                    }
                });

                return deferred.promise;
            };

            var getZoneShippingMethods = function (zoneId) {
                var deferred = $q.defer();
                var shippingMethods;
                var site = GlobalData.getSiteCode();
                ShippingREST.ShippingZones.all(site).all('zones').all(zoneId).all('methods').getList({ expand:'fees'}).then(function(methods){
                    shippingMethods = methods.length ? methods.plain() : [];
                    deferred.resolve(shippingMethods);
                }, function(failure){
                    console.log('From error');
                    if (failure.status === 404) {
                        deferred.resolve(shippingMethods);
                    } else {
                        deferred.reject(failure);
                    }
                });

                return deferred.promise;
            };

            var getCountryShippingCosts = function (countryCode) {
                var deferred = $q.defer();

                var isShipToPromise = getShipToCountries().then(
                    function (result) {
                        return result.indexOf(countryCode) > -1;
                    }
                );

                var zonePromise = getSiteShippingZones().then(
                    function (result) {
                        var zoneId;
                        var zones = result;
                        for (var i = 0; i < zones.length; i++) {
                            if (zones[i].shipTo.indexOf(countryCode) > -1) {
                                zoneId = zones[i].id;
                            }
                        }
                        return zoneId;
                    }
                );

                $q.all([isShipToPromise, zonePromise]).then(function(data){
                    
                    var isShipTo = data[0];
                    var zoneId = data[1];
                    if (isShipTo) {
                       getMethodCosts(zoneId).then(
                            function (result) {
                                deferred.resolve(result);
                            }
                       );
                    }else {
                        deferred.resolve([]);
                    }
                });
                
                return deferred.promise;
            };

            var getMethodCosts = function (zoneId) {
                var deferred = $q.defer();
                var shippingMethods;
                var shippingCosts = [];
                var site = GlobalData.getSiteCode();

                ShippingREST.ShippingZones.all(site).all('zones').all(zoneId).all('methods').getList({ expand:'fees'}).then(function(methods){
                    shippingMethods = methods.length ? methods.plain() : [];
                    for (var i = 0; i < shippingMethods.length; i++) {
                        for (var j = 0; j < shippingMethods[i].fees.length; j++) {
                            shippingMethods[i].fees[j].name = shippingMethods[i].name;
                            shippingCosts.push(shippingMethods[i].fees[j]);
                        }
                    }
                    deferred.resolve(shippingCosts);
                }, function(failure){
                    console.log('From error');
                    if (failure.status === 404) {
                        deferred.resolve(shippingMethods);
                    } else {
                        deferred.reject(failure);
                    }
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
                }, function(failure){
                    console.log('From error');
                    if (failure.status === 404) {
                        deferred.resolve(minCost);
                    } else {
                        deferred.reject(failure);
                    }
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
                }, function(failure){
                    console.log('From error');
                    if (failure.status === 404) {
                        deferred.resolve(shippingCosts);
                    } else {
                        deferred.reject(failure);
                    }
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

            getZoneShippingMethods: function (zoneId) {
                return getZoneShippingMethods(zoneId);
            },

            getCountryShippingCosts: function (siteCode) {
                return getCountryShippingCosts(siteCode);
            },

            getShippingCosts: function (item) {
                return getShippingCosts(item);
            },

            getMinimumShippingCost: function (item) {
                return getMinimumShippingCost(item);
            }

        };

    }]);
