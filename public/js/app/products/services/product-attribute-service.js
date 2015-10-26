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

(function () {
    'use strict';

    angular.module('ds.products')
        .factory('ProductAttributeSvc', ['Restangular', function (Restangular) {
            return {
                getSchema: function (schemaPath) {
                    return Restangular.oneUrl('schema', schemaPath).get();
                },

                getAttributeGroups: function (product) {
                    var groups = [];

                    for (var prop in product.mixins) {
                        if (/^attributegroup_*/.test(prop)) {
                            groups.push({
                                schema: product.metadata.mixins[prop],
                                attributes: product.mixins[prop]
                            });
                        }
                    }

                    return groups;
                },

                hasAnyOfAttributesSet: function (product) {
                    var groupsWithAtLeastOneAttributeSet = this.getAttributeGroups(product)
                        .filter(function (group) {
                            var hasAttributeSet = false;

                            for (var prop in group.attributes) {
                                if (group.attributes[prop] !== null) {
                                    hasAttributeSet = true;
                                    break;
                                }
                            }

                            return hasAttributeSet;
                        });

                    return groupsWithAtLeastOneAttributeSet.length > 0;
                },

                dateFormatting: {
                    date: 'd/M/yyyy',
                    time: 'hh:mm a',
                    dateTime: 'MM/dd/yyyy hh:mm a'
                }
            };
        }]);
})();