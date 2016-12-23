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

        .factory('ProductOptionsHelper', [
            function () {

                function isComplexAttribute(attribute) {
                    return _.isObject(attribute) || _.isArray(attribute);
                }

                function findOption(options, optionKey, attributeKey) {
                    return _.find(options, function (o) {
                        return o.optionKey === optionKey && o.attributeKey === attributeKey;
                    });
                }

                function findAttribute(attributes, value) {
                    return _.find(attributes, function (a) {
                        return a.value === value;
                    });
                }

                function prepareOptions(variants) {
                    var options = [];

                    for (var variantIndex = 0; variantIndex < variants.length; variantIndex++) {

                        for (var optionKey in variants[variantIndex].options) {
                            if (!variants[variantIndex].options.hasOwnProperty(optionKey)) { continue; }

                            for (var attributeKey in variants[variantIndex].options[optionKey]) {
                                if (!variants[variantIndex].options[optionKey].hasOwnProperty(attributeKey)) { continue; }
                                if (isComplexAttribute(variants[variantIndex].options[optionKey][attributeKey])) { continue; }

                                var option = findOption(options, optionKey, attributeKey);

                                if (_.isUndefined(option)) {
                                    option = {
                                        optionKey: optionKey,
                                        attributeKey: attributeKey,
                                        attributes: []
                                    };
                                    options.push(option);
                                }

                                var attribute = findAttribute(option.attributes, variants[variantIndex].options[optionKey][attributeKey]);

                                if (_.isUndefined(attribute)) {
                                    attribute = {
                                        value: variants[variantIndex].options[optionKey][attributeKey],
                                        variantIds: [],
                                        disabled: false
                                    };
                                    option.attributes.push(attribute);
                                }

                                attribute.variantIds.push(variants[variantIndex].id);
                            }
                        }
                    }

                    return options;
                }

				function selectOptionsForVariant(variant, availableOptions) {
					var selectedOptions = [];

                    var isVariantValid  = angular.isObject(variant);
                    var areOptionsValid = angular.isObject(availableOptions) && !angular.equals(availableOptions, {}) &&
						Object.keys(availableOptions).length > 0;

					if (isVariantValid && areOptionsValid) {
                        angular.forEach(availableOptions, function (option) {
                            angular.forEach(option.attributes, function (optionAttribute) {

                                if (optionAttribute !== null) {
                                    var foundOptionIdx = optionAttribute.variantIds.indexOf(variant.id);
                                    if( foundOptionIdx !== -1) {
                                        selectedOptions.push(optionAttribute);
                                    }
                                }
                            });
                        });
					}

					return selectedOptions;
				}


                function getSelectedAttributes(optionsSelected) {
                    return _.filter(optionsSelected, function (o) { return _.isObject(o); });
                }

                function getIdsOfMatchingVariants(attributesSelected) {
                    var variantIdsCollection = _.map(attributesSelected, function (a) {
                        return a.variantIds;
                    });

                    return _.intersection.apply(_, variantIdsCollection);
                }

                function getIdsOfAllVariants(variants) {
                    return _.map(variants, function (v) { return v.id; });
                }

                function updateOptions(options, idsOfMAtchingVariants) {

                    for (var optionIndex = 0; optionIndex < options.length; optionIndex++) {
                        for (var attributeIndex = 0; attributeIndex < options[optionIndex].attributes.length; attributeIndex++) {

                            var commonVariants = _.intersection(idsOfMAtchingVariants, options[optionIndex].attributes[attributeIndex].variantIds);
                            if (commonVariants.length > 0) {
                                options[optionIndex].attributes[attributeIndex].disabled = false;
                            } else {
                                options[optionIndex].attributes[attributeIndex].disabled = true;
                            }

                        }
                    }

                    return options;
                }

                return {
                    prepareOptions: prepareOptions,
					selectOptionsForVariant: selectOptionsForVariant,
                    getSelectedAttributes: getSelectedAttributes,
                    getIdsOfMatchingVariants: getIdsOfMatchingVariants,
                    getIdsOfAllVariants: getIdsOfAllVariants,
                    updateOptions: updateOptions
                };
            }]);
})();