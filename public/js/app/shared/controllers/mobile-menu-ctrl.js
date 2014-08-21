'use strict';

angular.module('ds.shared')
/** Handles interactions with mobile menu. */
    .controller('MobileMenuCtrl', ['$scope', '$rootScope',

        function ($scope, $rootScope) {

            /** Toggles the navigation menu for the mobile view. */
            $scope.toggleOffCanvas = function(){
                $rootScope.showMobileNav = !$rootScope.showMobileNav;

            };


        }]);