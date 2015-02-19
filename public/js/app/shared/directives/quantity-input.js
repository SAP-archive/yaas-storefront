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

'use strict';

angular.module('ds.shared')
/**
 * quantity-input
 * This directive restricts inputs to only accept numerical characters, as well as enter/tab/etc keystrokes
 * @return {Object}
 */
    .directive('quantityInput',[function(){
        return {
            restrict: 'A',
            link: function(scope, element) {
                element.bind('keydown', function (event) {
                    if (!(event.keyCode===13 || event.ctrlKey || event.altKey ||
                        (47<event.keyCode && event.keyCode<58 && event.shiftKey===false) ||
                        (95<event.keyCode && event.keyCode<106) ||
                        (event.keyCode===8) || (event.keyCode===9) ||
                        (event.keyCode>34 && event.keyCode<41) ||
                        (event.keyCode===46)))
                    {
                        event.preventDefault();
                    }
                });
            }
        };
    }]);