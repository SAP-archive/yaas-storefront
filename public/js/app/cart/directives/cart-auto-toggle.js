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
/**
 * cart-auto-toggle
 * This directive manages the cart's display
 * @return {Object}
 */
    .directive('cartAutoToggle',['$rootScope', function($rootScope){
        return {
            restrict: 'A',
            link: function(scope) {
                scope.cartAutoTimeoutLength = 3000;
                scope.cartShouldCloseAfterTimeout = false;
                scope.cartTimeOut = void 0;

                var closeCart = function(fromTimeout)
                {
                    //update angulars data binding to showCart
                    $rootScope.showCart = false;
                    scope.cartShouldCloseAfterTimeout = false;
                    if (fromTimeout) {
                        scope.$apply();
                    }

                };

                scope.createCartTimeout = function()
                {
                    //create a timeout object in order to close the cart if it's not hovered
                    scope.cartTimeOut = _.delay(
                        function()
                        {
                            //close the cart
                            closeCart(true);
                        },
                        scope.cartAutoTimeoutLength);
                };

                var unbind2 = $rootScope.$on('cart:closeAfterTimeout', function(){
                    scope.cartShouldCloseAfterTimeout = true;
                    //create a timeout object in order to close the cart if it's not hovered
                    scope.createCartTimeout();
                });

                var unbind3 = $rootScope.$on('cart:closeNow', function(){
                    scope.cartShouldCloseAfterTimeout = true;
                    $rootScope.showCart = false;
                });

                scope.$on('$destroy', unbind2, unbind3);

                scope.cartHover = function()
                {
                    clearTimeout(scope.cartTimeOut);
                };

                scope.keepCartOpen = function(){
                    scope.cartShouldCloseAfterTimeout = false;
                };

                scope.cartUnHover = function()
                {
                    //if none of the inputs are focused then create the 3 second timer after mouseout
                    if( !$('#cart input').is(':focus') && scope.cartShouldCloseAfterTimeout )
                    {
                        closeCart();
                    }

                };
            }
        };
    }]);