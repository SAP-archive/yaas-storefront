
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

'use strict';
//Used for determing the current visible items indexes
//It is checking if the details (name and price) part of item is visible
angular.module('ds.shared')
    .directive('stopEvent', [function () {
        return {
          restrict: 'A',
          link: function (scope, element, attr) {
            element.on(attr.stopEvent, function (e) {
              e.stopPropagation();
            });
          }

        };
    }]);
