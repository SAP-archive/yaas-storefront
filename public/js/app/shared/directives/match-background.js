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
    .directive('matchBackground',[ function(){

        return {
            restrict: 'A',
            scope: {
                hyMatchContainer: '@hyMatchContainer'
            },
            link: function(scope, element, attrs) {

                // match color of container into page background so it does not differ for 0 products.
                var bgColor = $(element).css('background-color');
                $('html').css('background-color', bgColor);
            }
        };
    }]);