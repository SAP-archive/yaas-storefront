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

(function () {
    'use strict';

    angular.module('ds.products')

        .filter('formatDateWithLocale', ['moment', function (moment) {
            return function (data) {
                return moment(data).format('L');
            };
        }])

        .filter('formatTimeWithLocale', ['moment', function (moment) {
            return function (data) {
                return moment(data).format('LT');
            };
        }])

        .filter('formatDateTimeWithLocale', ['moment', function (moment) {
            return function (data) {
                return moment(data).format('L LT');
            };
        }])

        ;
})();
