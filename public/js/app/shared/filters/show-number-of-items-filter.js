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
    .filter('showNoOfItems', ['$translate', function ($translate) {
        return function (data) {
            if (typeof (data) === 'undefined') {
                return $translate.instant('ORDER_ITEM_COUNT', { number: 0 });
            }

            if (data > 1) {
                return $translate.instant('ORDER_ITEMS_COUNT', { number: data });
            } else {
                return $translate.instant('ORDER_ITEM_COUNT', { number: data });
            }
        };
    }]);