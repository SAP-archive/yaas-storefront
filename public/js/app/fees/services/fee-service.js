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

angular.module('ds.fees')
    .factory('FeeSvc', ['$q', 'settings','GlobalData', 'FeeREST', function($q, settings, GlobalData, FeeREST) {

        var _getFeesForItemYrn = function(itemYrn) {
            var deferred = $q.defer();
            FeeREST.init();
            if(FeeREST.Fee) {
                // Build the search payload to post to the Fee service
                var searchData = {
                  itemYrns: [itemYrn],
                  siteCode: GlobalData.getSiteCode()
                };
                // Search fees for a itemYrn and a siteCode
                FeeREST.Fee.all('itemFees/search').post(searchData)
                    .then(function(data) {
                        var searchResults = data.plain();
                        // Make sure searchResults is an Array with values
                        if(Array.isArray(searchResults) && searchResults.length > 0) {
                            // Find the itemYrn in the searchResults
                            searchResults.forEach(function(result) {
                                if(result.itemYrn && result.fees && result.itemYrn === itemYrn) {
                                    // Create a new Array that will hold all the feeIDs for this itemYrn
                                    var feeIDsForProductYrn = [];
                                    result.fees.forEach(function(fee) {
                                        // Add each feeID in the Array
                                        feeIDsForProductYrn.push(fee.id);
                                    });
                                    // Retrieve all the fees information
                                    FeeREST.Fee.one('fees').get()
                                        .then(function(data) {
                                            // Filter helper function
                                            function isFeeForProductYrn(fee) {
                                                return feeIDsForProductYrn.indexOf(fee.id) >= 0;
                                            }
                                            var feesInformation = data.plain();
                                            // Filter the fees to only keep the one bounded to this itemYrn
                                            var feesForProductYrn = feesInformation.filter(isFeeForProductYrn);
                                            // Resolve the promise with the collection of fees for this itemYrn
                                            deferred.resolve(feesForProductYrn);
                                        });
                                }
                            });
                        }
                        else {
                            deferred.reject();
                        }
                    });
            }
            else {
                deferred.reject();
            }

            return deferred.promise;
        };

        var _getFeesForItemYrnList = function(itemYrnList) {
            var deferred = $q.defer();
            FeeREST.init();
            if(FeeREST.Fee && Array.isArray(itemYrnList)) {
                // Build the search payload to post to the Fee service
                var searchData = {
                    itemYrns: itemYrnList,
                    siteCode: GlobalData.getSiteCode()
                };
                // Search fees for an itemYrn list and a siteCode
                FeeREST.Fee.all('itemFees/search').post(searchData)
                    .then(function(data) {
                        var searchResults = data.plain();
                        if(Array.isArray(searchResults) && searchResults.length > 0) {
                            // Define maps to store:
                            //  - fee information for fee ID
                            //  - fee information for an itemYrn
                            var feeInformationForFeeIdMap = {};
                            var feesInformationForProductsYrnMap = {};

                            // Get fees detailed information as search does not return the displayName of each fee
                            FeeREST.Fee.one('fees').get()
                                .then(function(data) {
                                    // Get the fees information list
                                    var feesInformationList = data.plain();
                                    // Populate feeInformationForFeeIdMap
                                    feesInformationList.map(function(fee) {
                                        feeInformationForFeeIdMap[fee.id] = fee;
                                    });
                                    // Find itemYrn from the provided list in the search results
                                    searchResults.forEach(function(result) {
                                        if(result.itemYrn && result.fees && searchData.itemYrns.indexOf(result.itemYrn) >= 0) {
                                            feesInformationForProductsYrnMap[result.itemYrn] = [];
                                            result.fees.forEach(function(fee) {
                                                // Add fee information to the current itemYrn
                                                if(feeInformationForFeeIdMap[fee.id]) {
                                                    feesInformationForProductsYrnMap[result.itemYrn].push(feeInformationForFeeIdMap[fee.id]);
                                                }
                                            });
                                            deferred.resolve(feesInformationForProductsYrnMap);
                                        }
                                    });

                                });
                        }
                        else {
                            deferred.reject();
                        }
                    });
            }
            else {
                deferred.reject();
            }
            return deferred.promise;
        };

        return {
            /**
             * Returns an array of fees for a specific itemYrn
             * @param {String} itemYrn
             * @returns {Array} A collection of fee(s)
             */
            getFeesForItemYrn: _getFeesForItemYrn,

            /**
             * Returns a map of fees for each itemYrn
             * @param {Array} itemYrnList
             * @returns {Object} A map of fee(s) for each itemYrn
             */
            getFeesForItemYrnList: _getFeesForItemYrnList
        };

    }]);