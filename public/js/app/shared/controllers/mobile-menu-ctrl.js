'use strict';

angular.module('ds.shared')
/** Handles interactions with mobile menu, including interaction with mobile cart icon. */
    .controller('MobileMenuCtrl', ['$scope', '$rootScope','$state', '$controller', 'cart',

        function ($scope, $rootScope, $state, $controller, cart) {
            // Extending the basic cart icon controller
            $.extend(this, $controller('CartIconCtrl', {$scope: $scope, $rootScope: $rootScope, $state: $state, cart: cart}));

            /** Toggles the navigation menu for the mobile view. */
            $scope.toggleOffCanvas = function(){
                $rootScope.showMobileNav = !$rootScope.showMobileNav;

            };


        }]);