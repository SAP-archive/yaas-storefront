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

'use strict';

angular.module('ds.cart')
.factory('CartNoteMixinSvc', ['CartSvc', 'CartREST', '$q', 'SiteConfigSvc',
    function (CartSvc, CartREST, $q, siteConfigSvc) {

        return {
            updateNote: function(cartItem, noteContent) {
                var updatePromise = $q.defer();
                var noteMixin = {
                    metadata: {
                        mixins: {
                            note: siteConfigSvc.schemas.noteMixinMetadata
                        }
                    },
                    mixins: {
                        note: {
                            comment: noteContent
                        }
                    }
                };

                // Get cart info from CartSvc
                var cart = CartSvc.getLocalCart();

                CartREST.Cart.one('carts', cart.id).all('items').customPUT(noteMixin, cartItem.id + '?partial=true').then(function () {
                    CartSvc.refreshCart(cart.id, 'auto');
                    updatePromise.resolve();
                }, function () {
                    updatePromise.reject();
                });

                return updatePromise.promise;
            },

            removeNote: function(cartItem) {
                var removeNotePromise = $q.defer();
                var nulledNoteMixin = {
                    metadata: {
                        mixins: null
                    },
                    mixins: {
                        note: null
                    }
                };
                // Get cart info from CartSvc
                var cart = CartSvc.getLocalCart();

                CartREST.Cart.one('carts', cart.id).all('items').customPUT(nulledNoteMixin, cartItem.id + '?partial=true').then(function () {
                    CartSvc.refreshCart(cart.id, 'auto');
                    removeNotePromise.resolve();
                }, function () {
                    removeNotePromise.reject();
                });

                return removeNotePromise.promise;
            }
        };
}]);
