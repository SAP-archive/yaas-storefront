'use strict';

angular.module('ds.shared')
/** Handles interactions with the top menu (mobile menu, mobile search, mobile cart & full screen cart icon) */
    .controller('TopNavigationCtrl', ['$scope', '$rootScope', '$state', '$controller', 'GlobalData', 'cart',

        function ($scope, $rootScope, $state, $controller, GlobalData, cart) {

            $scope.GlobalData = GlobalData;
            $scope.cart = cart;


            var unbind = $rootScope.$on('cart:updated', function (eve, eveObj) {
                $scope.cart = eveObj;
            });

            $scope.$on('$destroy', unbind);


            /** Toggles the "show cart view" state as the cart icon is clicked. Note that this is the
             * actual cart details display, not the icon. */
            $scope.toggleCart = function () {
                $rootScope.showCart = !$rootScope.showCart;
                console.log('toggle cart - setting after is ' + $rootScope.showCart);
            };

            /** Determines if the cart icon should be displayed.*/
            $scope.isShowCartButton = function () {
                return !$state.is('base.checkout.details') && !$state.is('base.confirmation');
            };

            /** Toggles the navigation menu for the mobile view. */
            $scope.toggleOffCanvas = function () {
                $rootScope.showMobileNav = !$rootScope.showMobileNav;

            };

        }]);