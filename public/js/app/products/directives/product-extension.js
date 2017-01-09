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
        .directive('productExtension', ['ProductExtensionSvc', function (ProductExtensionSvc) {
            return {
                restrict: 'E',
                templateUrl: 'js/app/products/templates/product-extension.html',
                scope: {
                    schemaUrl: '@', mixin: '='
                },
                controller: ['$scope', '$q', 'moment', 'GlobalData', function ($scope, $q, moment, GlobalData) {

                    moment.locale(GlobalData.getLanguageCode());

                    $q.all([
                        ProductExtensionSvc.getSchema($scope.schemaUrl),
                        ProductExtensionSvc.getSchemaMetadata($scope.schemaUrl)
                    ])
                        .then(function (responses) {
                            $scope.definition = responses[0].plain();
                            $scope.name = responses[1].metadata.name;
                        });

                }]
            };
        }]);
})();