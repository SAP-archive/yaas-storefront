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

        .constant('ExcludedMixins', ['inventory'])

        .factory('ProductExtensionHelper', ['ExcludedMixins',
            function (ExcludedMixins) {

                function resolveMixins(product) {
                    var effectiveMixins = {};

                    angular.forEach(product.mixins, function (mixin, id) {
                        if (ExcludedMixins.indexOf(id) === -1) {
                            effectiveMixins[id] = mixin;
                        }
                    });

                    return effectiveMixins;
                }

                return {
                    resolveMixins: resolveMixins
                };
            }]);
})();