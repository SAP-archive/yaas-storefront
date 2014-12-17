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

angular.module('ds.shared')
    .directive('matchBackground',[ function() {
        return {
            restrict: 'A',
            link: function(scope, element) {
                // match color of container to page background so that it will not differ for short verticle views.
                var bgColor = $(element).css('background-color');
                $('html').css('background-color', bgColor);
            }
        };
    }]);