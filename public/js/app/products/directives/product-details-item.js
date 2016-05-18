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
                        if (/^attribute_*/.test($scope.name) && angular.isArray($scope.definition.oneOf)) {
                            $scope.displayedName = $scope.definition.oneOf[0].title;
                            $scope.type = $scope.definition.oneOf[0].type;
                            $scope.stringFormat = $scope.definition.oneOf[0].format;

                            return;
                        }

                        $scope.displayedName = ProductDetailsItemHelper.resolveName($scope.definition, $scope.name);
                        $scope.type = ProductDetailsItemHelper.resolveType($scope.definition, $scope.value);

                        if ($scope.type === 'string') {
                            $scope.stringFormat = $scope.definition.format;
                        }
                        if ($scope.type === 'object') {
                            $scope.propertyOrder = ProductDetailsItemHelper.toOrderArray($scope.definition.properties);
                        }
                    }]
            };
        }])
        ;
})();