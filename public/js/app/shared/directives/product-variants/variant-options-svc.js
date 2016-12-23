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

(function() {
    'use strict';

    angular.module('ds.shared')
        .factory('VariantOptionsSvc', [function () {

            function getProductVariants (options) {
                var tempVariants = [];
                var variants = [];
                setVariantOptions(options, tempVariants, '');
                for (var i = 0; i < tempVariants.length; i++) {
                    var index = findVariantIndex(variants, tempVariants[i].name);
                    var level = findVariantLevel(variants, tempVariants[i].path);
                    tempVariants[i].level = level;
                    if (index > -1) {
                        variants[index].value += ',' +  tempVariants[i].value;
                    } else {
                        variants.push(tempVariants[i]);
                    }
                }
                return variants;
            }

            function setVariantOptions (options, variantArray, path) {
                for (var prop in options) {
                    if (Object.prototype.toString.call(options[prop]) === '[object Array]') {
                        variantArray.push({name: prop, path: path});
                        for (var i = 0; i < options[prop].length; i++) {
                            setVariantOptions(options[prop][i], variantArray, path + '.' + prop);
                        }
                    }
                    else if (typeof(options[prop]) === 'object') {
                        setVariantOptions(options[prop], variantArray, path + '.' + prop);
                    } else {
                        variantArray.push({name: prop, value: options[prop], path: path});
                    }
                }
            }

            function findVariantIndex (variants, variantName) {
                for (var i = 0; i < variants.length; i++) {
                    if (variants[i].name === variantName) {
                        return i;
                    }
                }
                return -1;
            }

            function findVariantLevel (variants, variantLevel) {
                var levelCounter = 0;
                var pathElements = variantLevel.split('.');
                for (var i = 0; i < variants.length; i++) {
                    for (var j = 0; j < pathElements.length; j++) {
                        if (variants[i].name === pathElements[j]) {
                            levelCounter++;
                        }
                    }
                }
                return levelCounter;
            }

            return {
                getProductVariants: getProductVariants
            };

        }]);
})();