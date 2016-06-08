/**
 * [y] hybris Platform
 *
 * Copyright (c) 2000-2016 hybris AG
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of hybris
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with hybris.
 */

(function () {
    'use strict';

    angular.module('ds.products')

        .factory('ProductDetailHelper', [
            function () {

                function findIndex(values, search) {
                    return _.findIndex(values, function (item) {
                        return item.value === search;
                    });
                }

                function prepareOptions(variants) {
                    var options = {};

                    for (var variantIndex = 0; variantIndex < variants.length; variantIndex++) {

                        for (var optionKey in variants[variantIndex].options) {
                            if (!variants[variantIndex].options.hasOwnProperty(optionKey)) { continue; }

                            for (var attributeKey in variants[variantIndex].options[optionKey]) {
                                if (!variants[variantIndex].options[optionKey].hasOwnProperty(attributeKey)) { continue; }

                                if (!angular.isObject(options[optionKey])) {
                                    options[optionKey] = {};
                                }

                                if (!angular.isArray(options[optionKey][attributeKey])) {
                                    options[optionKey][attributeKey] = [];
                                }

                                var index = findIndex(options[optionKey][attributeKey], variants[variantIndex].options[optionKey][attributeKey]);

                                if (index === -1) {
                                    options[optionKey][attributeKey].push({
                                        value: variants[variantIndex].options[optionKey][attributeKey],
                                        variants: [variantIndex],
                                        disabled: false
                                    });
                                } else {
                                    options[optionKey][attributeKey][index].variants.push(variantIndex);
                                }

                            }
                        }
                    }

                    return options;
                }

                function getIdsOfMatchingVariants(selectedOptions) {

                    var idsOfMatchingVariants;

                    for (var optionKey in selectedOptions) {
                        if (!selectedOptions.hasOwnProperty(optionKey)) { continue; }

                        for (var attributeKey in selectedOptions[optionKey]) {
                            if (!selectedOptions[optionKey].hasOwnProperty(attributeKey)) { continue; }

                            if (angular.isObject(selectedOptions[optionKey][attributeKey])) {
                                if (angular.isArray(idsOfMatchingVariants)) {
                                    idsOfMatchingVariants = _.intersection(idsOfMatchingVariants, selectedOptions[optionKey][attributeKey].variants);
                                } else {
                                    idsOfMatchingVariants = selectedOptions[optionKey][attributeKey].variants;
                                }
                            }
                        }
                    }

                    return idsOfMatchingVariants;
                }

                function updateOptions(options, selectedVariants) {

                    for (var optionKey in options) {
                        if (!options.hasOwnProperty(optionKey)) { continue; }

                        for (var attributesKey in options[optionKey]) {
                            if (!options[optionKey].hasOwnProperty(attributesKey)) { continue; }

                            for (var i = 0; i < options[optionKey][attributesKey].length; i++) {
                                var commonVariants = _.intersection(selectedVariants, options[optionKey][attributesKey][i].variants);
                                if (commonVariants.length > 0) {
                                    options[optionKey][attributesKey][i].disabled = false;
                                } else {
                                    options[optionKey][attributesKey][i].disabled = true;
                                }
                            }
                        }
                    }

                    return options;
                }

                return {
                    prepareOptions: prepareOptions,
                    getIdsOfMatchingVariants: getIdsOfMatchingVariants,
                    updateOptions: updateOptions
                };
            }]);
})();