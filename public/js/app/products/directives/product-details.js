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
        .directive('productDetails', ['ProductDetailsSvc', function (ProductDetailsSvc) {
            return {
                restrict: 'E',
                templateUrl: 'js/app/products/templates/product-details.html',
                scope: {
                    schema: '@', mixin: '='
                },
                controller: ['$scope', function ($scope) {
                    ProductDetailsSvc.getSchema($scope.schema).then(function (response) {
                        $scope.definition = response.plain();
                    });
                }]
            };
        }]);
})();