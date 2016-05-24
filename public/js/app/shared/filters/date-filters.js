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

    angular.module('ds.shared')

        .constant('DateFormats', {
            date: 'MM/dd/yyyy',
            time: 'hh:mm a',
            dateTime: 'MM/dd/yyyy hh:mm a'
        })

        .filter('defaultDate', ['$filter', 'DateFormats', function ($filter, DateFormats) {
            return function (data) {
                return $filter('date')(data, DateFormats.date);
            };
        }])

        .filter('defaultTime', ['$filter', 'DateFormats', function ($filter, DateFormats) {
            return function (data) {
                return $filter('date')(data, DateFormats.time);
            };
        }])

        .filter('defaultDateTime', ['$filter', 'DateFormats', function ($filter, DateFormats) {
            return function (data) {
                return $filter('date')(data, DateFormats.dateTime);
            };
        }])

        ;
})();