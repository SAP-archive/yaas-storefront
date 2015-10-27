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
        .directive('productAttributeGroups', function () {
            return {
                restrict: 'E',
                templateUrl: 'js/app/products/templates/product-attribute-groups.html',
                scope: {
                    product: '='
                },
                controller: ['$scope', 'ProductAttributeSvc', function ($scope, ProductAttributeSvc) {
                    $scope.attributeGroups = ProductAttributeSvc.getAttributeGroups($scope.product);
                }]
            };
        });
})();