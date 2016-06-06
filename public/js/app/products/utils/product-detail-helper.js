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

                function prepareOptions(variants) {
                    var options = {};

                    angular.forEach(variants, function (variant, variantIndex) {
                        angular.forEach(variant.options, function (option, optionKey) {
                            angular.forEach(option, function (attribute, attributeKey) {

                                if (!angular.isObject(options[optionKey])) {
                                    options[optionKey] = {};
                                }

                                if (!angular.isArray(options[optionKey][attributeKey])) {
                                    options[optionKey][attributeKey] = [];
                                }

                                var index = _.findIndex(options[optionKey][attributeKey], function (item) {
                                    return item.value === attribute;
                                });

                                if (index === -1) {
                                    options[optionKey][attributeKey].push({
                                        value: attribute,
                                        variants: [variantIndex],
                                        disabled: false
                                    });
                                } else {
                                    options[optionKey][attributeKey][index].variants.push(variantIndex);
                                }

                            });
                        });
                    });

                    return options;
                }

                function getIdsOfMatchingVariants(selectedOptions) {

                    var idsOfMatchingVariants;

                    angular.forEach(selectedOptions, function (option, optionKey) {
                        angular.forEach(option, function (attribute, attributeKey) {
                            if (angular.isObject(attribute)) {
                                if (angular.isArray(idsOfMatchingVariants)) {
                                    idsOfMatchingVariants = _.intersection(idsOfMatchingVariants, attribute.variants);    
                                } else {
                                    idsOfMatchingVariants = attribute.variants;
                                }
                            }
                        });
                    });

                    return idsOfMatchingVariants;
                };

                function updateOptions(options, selectedVariants) {

                    angular.forEach(options, function (option) {
                        angular.forEach(option, function (attributes) {
                            angular.forEach(attributes, function (attribute) {

                                var commonVariants = _.intersection(selectedVariants, attribute.variants);
                                if (commonVariants.length > 0) {
                                    attribute.disabled = false;
                                } else {
                                    attribute.disabled = true;
                                }
                            });

                        });
                    });

                    return options;
                };

                return {
                    prepareOptions: prepareOptions,
                    getIdsOfMatchingVariants: getIdsOfMatchingVariants,
                    updateOptions: updateOptions
                };
            }]);
})();