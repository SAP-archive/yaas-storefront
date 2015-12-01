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

    angular.module('ds.shared')
        .directive('forceScroll', [function () {
            return {
                restrict: 'M',
                scope: false,
                controller: ['$rootScope', '$scope', function ($rootScope, $scope) {
                    $rootScope.forceScroll = true;

                    $scope.$on('$destroy', function () {
                        $rootScope.forceScroll = false;
                    });
                }]
            };
        }]);
})();