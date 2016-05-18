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
        .factory('ProductExtensionSvc', ['Restangular',
            function (Restangular) {
                return {
                    getSchema: function (schemaUrl) {
                        return Restangular.oneUrl('schema', schemaUrl).get();
                    },
                    getSchemaMetadata: function (schemaUrl) {
                        return Restangular.oneUrl('schema', schemaUrl + '/metadata').get();
                    }
                };
            }]);
})();