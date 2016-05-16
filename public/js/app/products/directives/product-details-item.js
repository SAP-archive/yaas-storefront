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

        .factory('productDetailsItemHelper', [function () {
            return {
                getType: function (value) {
                    if (angular.isArray(value)) {
                        return 'array';
                    }
                    if (angular.isObject(value)) {
                        return 'object';
                    }
                    if (angular.isString(value)) {
                        return 'string';
                    }
                    if (typeof (value) === 'boolean') {
                        return 'boolean';
                    }
                },
                getDateFormatting: function () {
                    return {
                        date: 'MM/dd/yyyy',
                        time: 'hh:mm a',
                        dateTime: 'MM/dd/yyyy hh:mm a'
                    };
                },
                toOrderArray: function (object) {
                    var array = [];

                    angular.forEach(object, function (value, key) {
                        array.push({ 'key': key, 'value': value });
                    });

                    array.sort(function (lItem, rItem) {
                        if (angular.isUndefined(lItem.value.order) && angular.isUndefined(rItem.value.order)) {
                            return 0;
                        }

                        if (angular.isUndefined(lItem.value.order)) {
                            return 1;
                        }

                        if (angular.isUndefined(rItem.value.order)) {
                            return -1;
                        }

                        return lItem.value.order - rItem.value.order;
                    });

                    return array.map(function (item) {
                        return item.key;
                    });
                }
            };
        }])

        .directive('productDetailsItem', [function () {
            return {
                restrict: 'E',
                templateUrl: 'js/app/products/templates/product-details-item.html',
                scope: {
                    name: '@', value: '=', definition: '='
                },
                controller: ['$scope', 'productDetailsItemHelper',
                    function ($scope, productDetailsItemHelper) {
                        $scope.type = productDetailsItemHelper.getType($scope.value);

                        if ($scope.type === 'string') {
                            $scope.dateFormatting = productDetailsItemHelper.getDateFormatting();
                        }
                        if ($scope.type === 'object') {
                            $scope.propertyOrder = productDetailsItemHelper.toOrderArray($scope.definition.properties);
                        }
                    }]
            };
        }]);
})();