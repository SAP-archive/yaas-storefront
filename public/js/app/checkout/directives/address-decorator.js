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

angular.module('ds.checkout')
/**
 * address-decorator
 *
 * adds the 'selected' attribute to the currently selected address and removes it from other addresses, thereby adding
 * a check mark next to the selected address
 */
    .directive('addressDecorator',[function(){
        return {
            restrict: 'A',
            link: function(scope) {
                angular.forEach(scope.addresses, function (addr) {
                    if (scope.target && scope.target.id) {
                        if (addr.id && addr.id === scope.target.id) {
                            addr.selected = true;
                        }
                        else {
                            addr.selected = false;
                        }
                    }
                });
            }
        };
    }]);