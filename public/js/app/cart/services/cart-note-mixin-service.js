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

angular.module('ds.cart').factory('CartNoteMixinSvc', ['$rootScope', 'CartSvc', 'CartREST', '$q',
	function ($rootScope, CartSvc, CartREST, $q) {
		// To be added to cart item's Metadata property
		var noteMixinMetadata = 'https://api.yaas.io/hybris/schema/v1/hybriscommerce/cart-item-note-1.0.0';

		return {
			updateNote: function(cartItem, noteContent){
				var updatePromise = $q.defer();
				var noteMixin = {
					metadata: {
						mixins: {
							note: noteMixinMetadata
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

				CartREST.Cart.one('carts', cart.id).all('items').customPUT(noteMixin, cartItem.id + '?partial=true')
					.then(function () {
						CartSvc.refreshCart(cart.id, 'auto');
						updatePromise.resolve();
					},
					function () {
						updatePromise.reject();
					}
				);

				return updatePromise.promise;
			}
		};
}]);