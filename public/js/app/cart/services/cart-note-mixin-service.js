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
                updateNote: function(cartItem, noteContent){
                    var updatePromise = $q.defer();
                    
                    var noteMixin = {
                        metadata: {
                            mixins: {
                                // TODO TP-4285 we will create our own schema or use inline mixins
                                note: siteConfigSvc.schemas.noteMixinMetadata
                            }
                        },
                        mixins: {
                            note: {
                                code: noteContent
                            }
                        }
                    };
                    
                    // Get cart info from CartSvc
                    var cart = CartSvc.getLocalCart();
                    var cartUpdateMode = 'auto';
                    
                    CartREST.Cart.one('carts', cart.id)
                    .all('items')
                    .customPUT(noteMixin, cartItem.id + '?partial=true')
                    .then(function () {
                            CartSvc.refreshCart(cart.id, cartUpdateMode);
                            updatePromise.resolve();
                        },
                        function () {
                            updatePromise.reject();
                        }
                    );
                    
                    return updatePromise.promise;
                }
            };
        }
    ]);
