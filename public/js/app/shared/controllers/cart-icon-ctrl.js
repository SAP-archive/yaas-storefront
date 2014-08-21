'use strict';

angular.module('ds.shared')
     /** Handles interactions with the cart icon.  Listens to the 'cart:updated' event - on update,
      * the cart icon will reflect the updated cart quantity. */
	.controller('CartIconCtrl', ['$scope', '$state', '$rootScope','cart',

		function ($scope, $state, $rootScope, cart) {
            console.log('instantiating cart icon controller');

            $scope.cart = cart;

            var unbind = $rootScope.$on('cart:updated', function(eve, eveObj){
                $scope.cart = eveObj;
            });

            $scope.$on('$destroy', unbind);


            /** Toggles the "show cart view" state as the cart icon is clicked. Note that this is the
             * actual cart details display, not the icon. */
            $scope.toggleCart = function (){

                $rootScope.showCart=!$rootScope.showCart;
                console.log('toggle cart - setting after is '+$rootScope.showCart);
            };


            $scope.isShowCartButton = function() {
                console.log('checking isShowCart');
                return !$state.is('base.checkout.details') && !$state.is('base.confirmation');
            };

	}]);