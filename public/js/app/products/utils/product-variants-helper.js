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

        .factory('ProductVariantsHelper', [
            function () {

				function getFirstAvailableVariant(variants) {
					return angular.isArray(variants) && variants.length > 0 && !angular.equals(variants[0], {}) ? variants[0] : undefined;
				}

				function getDefaultVariantWithFallback(variants) {
					var foundVariant = null;
					if (angular.isObject(variants) && !angular.equals(variants, {}) &&
						Object.keys(variants).length > 0) {

						angular.forEach(variants, function (variant) {
							if (variant !== null && variant.default === true) {
								foundVariant = variant;
								return;
							}
						});
					}

					return foundVariant ? foundVariant : getFirstAvailableVariant(variants);

				}

				function getSelectedVariantWithFallback(variantId, variants) {
					var foundVariant = null;
					if (angular.isObject(variants) && !angular.equals(variants, {}) && Object.keys(variants).length > 0 && variantId) {

						angular.forEach(variants, function (variant) {
							if (variant !== null && variant.id === variantId) {
								foundVariant = variant;
								return;
							}
						});

					}

					return foundVariant ? foundVariant : getDefaultVariantWithFallback(variants);
				}

                return {
					getDefaultVariantWithFallback: getDefaultVariantWithFallback,
					getSelectedVariantWithFallback: getSelectedVariantWithFallback
                };
            }]);
})();