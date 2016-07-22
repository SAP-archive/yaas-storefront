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

                function resolveMediaForProduct(product) {
                    return Array.isArray(product.media) ? product.media : [];
                }

                function fromProduct(product, prices, isBuyable) {

                    var media = resolveMediaForProduct(product);

                    var createdProduct = {
                        id: product.id,
                        code: product.code,
                        name: product.name,
                        description: product.description,
                        media: CommittedMediaFilter.filter(media),
                        isBuyable: isBuyable,
                        inStock: product.mixins && product.mixins.inventory && product.mixins.inventory.inStock,
                        prices: prices
                    };

                    if (createdProduct.media.length === 0) {
                        createdProduct.media.push({ id: settings.placeholderImageId, url: settings.placeholderImage });
                    }

                    return createdProduct;
                }

                function resolveMediaForProductVariant(product, variant) {
                    var media = [];

                    if (Array.isArray(variant.media) && variant.media.length > 0) {
                        media = variant.media;
                    } else if (Array.isArray(product.media)) {
                        media = product.media;
                    }

                    return media;
                }

                function fromProductVariant(product, variant, prices) {

                    var media = resolveMediaForProductVariant(product, variant);

                    var createdProduct = {
                        id: variant.id,
                        code: variant.code,
                        name: variant.name ? variant.name : product.name,
                        description: product.description,
                        media: CommittedMediaFilter.filter(media),
                        isBuyable: true,
                        inStock: variant.mixins && variant.mixins.inventory && variant.mixins.inventory.inStock,
                        prices: prices
                    };

                    if (createdProduct.media.length === 0) {
                        createdProduct.media.push({ id: settings.placeholderImageId, url: settings.placeholderImage });
                    }

                    return createdProduct;
                }

                return {
                    fromProduct: fromProduct,
                    fromProductVariant: fromProductVariant
                };
            }]);
})();