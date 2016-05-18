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

        .constant('DateFormatting', {
            date: 'MM/dd/yyyy',
            time: 'hh:mm a',
            dateTime: 'MM/dd/yyyy hh:mm a'
        })

        .factory('ProductDetailsItemHelper', ['DateFormatting',
            function (DateFormatting) {
                return {
                    getDateFormatting: function () {
                        return DateFormatting;
                    },
                    toOrderArray: function (object) {
                        var array = [];

                        angular.forEach(object, function (value, key) {
                            array.push({ 'key': key, 'value': value });
                        });

                        array.sort(function (lItem, rItem) {
                            if (angular.isUndefined(lItem.value.order) && angular.isUndefined(rItem.value.order)) {
                                return 0;
                            }

                            if (angular.isUndefined(lItem.value.order)) {
                                return 1;
                            }

                            if (angular.isUndefined(rItem.value.order)) {
                                return -1;
                            }

                            return lItem.value.order - rItem.value.order;
                        });

                        return array.map(function (item) {
                            return item.key;
                        });
                    }
                };
            }]);
})();