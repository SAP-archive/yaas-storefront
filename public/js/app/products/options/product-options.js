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
                    onActiveVariantChanged: '&'
                },
                controller: ['$scope', 'ProductOptionsHelper', 'ColorAffinitySvc',
                    function productOptionsCtrl($scope, ProductOptionsHelper, ColorAffinitySvc) {

                        $scope.options = ProductOptionsHelper.prepareOptions($scope.variants);
                        $scope.optionsSelected = [];

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

                        $scope.omitSelectionAndUpdateOptions = function (omittedIndex) {
                            var omitted = _.union([], $scope.optionsSelected);
                            omitted[omittedIndex] = null;

                            var attributesSelected = ProductOptionsHelper.getSelectedAttributes(omitted);
                            var idsOfMatchingVariants = getIdsOfMatchingVariants(attributesSelected);

                            $scope.options = ProductOptionsHelper.updateOptions($scope.options, idsOfMatchingVariants);
                        };
                        
                        //Color variants
                        var selectColorVariant = function(affinities, colorIndex){
                            
                            for(var i = 0; i < affinities.length; i++){
                                for(var j = 0; j < $scope.options[colorIndex].attributes.length; j++){
                                    if($scope.options[colorIndex].attributes[j].value === affinities[i].value){
                                        //Found the correct one
                                        $scope.optionsSelected[colorIndex] = $scope.options[colorIndex].attributes[j];
                                        $scope.resolveActiveVariantAndUpdateOptions();
                                        return;
                                    }
                                }
                            }
                        };

                        var processColorAffinities = function(affinities){
                            affinities = affinities || [];

                            //Sort by score
                            affinities = affinities.sort(function(a, b){
                                if(a.score < b.score){
                                    return 1;
                                }
                                if(a.score > b.score){
                                    return -1;
                                }
                                return 0;
                            });

                            //Return only important stuff
                            affinities = affinities.map(function(affinity){
                                return {
                                    value: affinity.tid,
                                    score: affinity.score
                                };
                            });

                            //Find color attribute
                            var colorIndex = -1;
                            for(var i = 0; i < $scope.options.length; i++){
                                if($scope.options[i].attributeKey == 'Color'){
                                    colorIndex = i;
                                    break;
                                }
                            }

                            //Check if color attribute exists
                            if(colorIndex < 0){
                                return;
                            }

                            //Set color variant
                            selectColorVariant(affinities, colorIndex);
                        };

                        var getAffinities = function(){
                            //Profile variants preference
                            if($scope.variants && $scope.variants.length && $scope.variants.length > 0){
                                //get color preference for this product??
                                var piwikId = window.Y_TRACKING._id;
                                var colors = [];
                                
                                colors = $scope.variants.map(function(variant){
                                    if(variant.options && variant.options['color-7wri3aq']){
                                        return variant.options['color-7wri3aq'].Color;
                                    }
                                });

                                ColorAffinitySvc.getAffinities(piwikId, colors)
                                    .then(function(res){
                                        processColorAffinities(res);
                                    }, function(){
                                        console.error('Failed getting color affinities.');
                                    });
                            }
                        };

                        //Get color affinities
                        getAffinities();
                        
                    }]
            };
        }]);
})();