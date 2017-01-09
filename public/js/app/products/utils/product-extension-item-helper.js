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
        .constant('ExtensionDefinitionDateFormats', {
            date: 'DD-MM-YYYY',
            time: 'HH:mm:ss'
        })
        .factory('ProductExtensionItemHelper', ['ExtensionDefinitionDateFormats', 'moment', function (ExtensionDefinitionDateFormats, moment) {
            return {
                resolveName: function (definition, name) {
                    if (definition.title) {
                        return definition.title;
                    }

                    return name;
                },

                resolveType: function (definition, value) {
                    if (definition.type) {
                        return definition.type;
                    }

                    if (angular.isObject(value)) {
                        return 'object';
                    }
                    if (angular.isArray(value)) {
                        return 'array';
                    }
                },

                stringToDate: function (stringFormat, value) {
                    if (stringFormat in ExtensionDefinitionDateFormats && moment(value, ExtensionDefinitionDateFormats[stringFormat], true).isValid()) {
                        return moment(value, ExtensionDefinitionDateFormats[stringFormat], true);
                    }
                    else {
                        return value;
                    }
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