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
        .directive('productOptions', [function () {
            return {
                restrict: 'E',
                templateUrl: 'js/app/products/templates/product-options/product-options.html',
                scope: {
                    variants: '=',
					selectedVariant: '=',
                    onActiveVariantChanged: '&'
                },
                controller: ['$scope', 'ProductOptionsHelper', 'ProductVariantsHelper',
                    function productOptionsCtrl($scope, ProductOptionsHelper, ProductVariantsHelper) {

                        $scope.options = ProductOptionsHelper.prepareOptions($scope.variants);
						
						var variant = ProductVariantsHelper.getDefaultVariantWithFallback($scope.variants);

						$scope.optionsSelected = ProductOptionsHelper.selectOptionsForVariant($scope.selectedVariant, $scope.options);


                        function getIdsOfMatchingVariants(attributesSelected) {
                            return attributesSelected.length === 0 ?
                                ProductOptionsHelper.getIdsOfAllVariants($scope.variants) :
                                ProductOptionsHelper.getIdsOfMatchingVariants(attributesSelected);
                        }

                        function getVariant(varaintId) {
                            return _.find($scope.variants, function (v) { return v.id === varaintId; });
                        }

                        $scope.resolveActiveVariantAndUpdateOptions = function () {
                            var attributesSelected = ProductOptionsHelper.getSelectedAttributes($scope.optionsSelected);
                            var idsOfMatchingVariants = getIdsOfMatchingVariants(attributesSelected);

                            $scope.options = ProductOptionsHelper.updateOptions($scope.options, idsOfMatchingVariants);

                            var activeVariant;
                            if (attributesSelected.length === $scope.options.length) {
                                activeVariant = getVariant(idsOfMatchingVariants[0]);
                            }

                            $scope.onActiveVariantChanged({ activeVariant: activeVariant });
                        };

						if(variant) {
							$scope.resolveActiveVariantAndUpdateOptions();
						}

                        $scope.omitSelectionAndUpdateOptions = function (omittedIndex) {
                            var omitted = _.union([], $scope.optionsSelected);
                            omitted[omittedIndex] = null;

                            var attributesSelected = ProductOptionsHelper.getSelectedAttributes(omitted);
                            var idsOfMatchingVariants = getIdsOfMatchingVariants(attributesSelected);

                            $scope.options = ProductOptionsHelper.updateOptions($scope.options, idsOfMatchingVariants);
                        };

                    }]
            };
        }]);
})();