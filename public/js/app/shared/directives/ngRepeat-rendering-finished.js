/**
 * [y] hybris Platform
 *
 * Copyright (c) 2000-2014 hybris AG
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of hybris
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with hybris.
 */

'use strict';
//Used for determing when the ng repeat has finished with rendering elements
angular.module('ds.shared')
    .directive('onFinishRenderNgRepeat', ['$timeout','$rootScope',function ($timeout, $rootScope) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                if (scope.$last === true) {
                    $timeout(function () {
                        $rootScope.$broadcast(attrs.onFinishRenderNgRepeatEvent);
                    });
                }
            }
        };
    }]);