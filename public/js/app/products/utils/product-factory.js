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
        .factory('productFactory', ['CommittedMediaFilter', 'settings',
            function (CommittedMediaFilter, settings) {

                function fromProduct(product, prices) {
                    var createdProduct = {
                        id: product.id,
                        code: product.code,
                        name: product.name,
                        description: product.description,
                        media: Array.isArray(product.media) ? CommittedMediaFilter.filter(product.media) : [],
                        inStock: product.mixins.inventory.inStock,
                        prices: prices
                    };

                    if (createdProduct.media.length === 0) {
                        createdProduct.media.push({ id: settings.placeholderImageId, url: settings.placeholderImage });
                    }

                    return createdProduct;
                }

                function fromVariant(variant, product, prices) {
                    return {
                        id: variant.id,
                        code: variant.code,
                        name: variant.name ? variant.name : product.name,
                        description: product.description,
                        media: Array.isArray(variant.media) ? CommittedMediaFilter.filter(variant.media) : [],
                        inStock: product.mixins.inventory.inStock, // todo: this will be replaced with variants inStock
                        prices: prices
                    };
                }

                return {
                    fromProduct: fromProduct,
                    fromVariant: fromVariant
                };
            }]);
})();