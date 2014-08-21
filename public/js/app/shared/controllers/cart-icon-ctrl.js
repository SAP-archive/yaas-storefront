'use strict';

angular.module('ds.shared')
     /** Handles interactions with the cart icon.  Listens to the 'cart:updated' event - on update,
      * the cart icon will reflect the updated cart quantity. */
	.controller('CartIconCtrl', ['$scope', '$state', '$rootScope','cart',

		function ($scope, $state, $rootScope, cart) {
            $scope.cart = cart;

            var unbind = $rootScope.$on('cart:updated', function(eve, eveObj){
                $scope.cart = eveObj;
            });

            $scope.$on('$destroy', unbind);


            /** Toggles the "show cart view" state as the cart icon is clicked. Note that this is the
             * actual cart details display, not the icon. */
            $scope.toggleCart = function (){
                $rootScope.showCart=!$rootScope.showCart;
            };


            $scope.isShowCartButton = function() {
                return !$state.is('base.checkout.details') && !$state.is('base.confirmation');
            };

	}]);