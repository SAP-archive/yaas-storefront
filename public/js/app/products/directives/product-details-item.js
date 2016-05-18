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

(function () {
    'use strict';

    angular.module('ds.products')
        .directive('productDetailsItem', [function () {
            return {
                restrict: 'E',
                templateUrl: 'js/app/products/templates/product-details-item.html',
                scope: {
                    name: '@', value: '=', definition: '='
                },
                controller: ['$scope', 'ProductDetailsItemHelper',
                    function ($scope, ProductDetailsItemHelper) {

                        // handle legacy attribute groups, to be removed in future
                        var hasAttribute = function (object) {
                            var numOfAttributes = 0;
                            angular.forEach(object, function (v, k) {
                                if (/^attribute_*/.test(k)) {
                                    numOfAttributes++;
                                }
                            });
                            return numOfAttributes > 0;
                        };

                        if (angular.isObject($scope.value) && hasAttribute($scope.value)) {
                            $scope.displayedName = $scope.definition.title;
                            $scope.type = 'object';
                            $scope.propertyOrder = ProductDetailsItemHelper.toOrderArray($scope.definition.properties);
                            return;
                        }

                        if (/^attribute_*/.test($scope.name) && angular.isArray($scope.definition.oneOf)) {
                            $scope.displayedName = $scope.definition.oneOf[0].title;
                            $scope.stringFormat = $scope.definition.oneOf[0].format;
                            $scope.type = $scope.definition.oneOf[0].type || 'object';

                            return;
                        }
                        // legacy ends here

                        $scope.displayedName = $scope.name;
                        $scope.type = $scope.definition.type;

                        if ($scope.type === 'string') {
                            $scope.stringFormat = $scope.definition.format;
                            $scope.dateFormatting = ProductDetailsItemHelper.getDateFormatting();
                        }
                        if ($scope.type === 'object') {
                            $scope.propertyOrder = ProductDetailsItemHelper.toOrderArray($scope.definition.properties);
                        }
                    }]
            };
        }])
        ;
})();