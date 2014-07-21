'use strict';

angular.module('ds.shared')
     /** Handles interactions in the navigation bar.  Listens to the 'cart:updated' event - on update,
      * the cart icon will reflect the updated cart quantity. */
	.controller('NavigationCtrl', ['$scope', '$rootScope','$translate', 'GlobalData', 'i18nConstants', 'cart', 'showCartIcon',

		function ($scope, $rootScope, $translate, GlobalData, i18nConstants, cart, showCartIcon) {

            $scope.cart = cart;
            $scope.showCartIcon = showCartIcon;  // determines display of cart icon
			$scope.languageCode = GlobalData.languageCode;
            $scope.languageCodes = i18nConstants.getLanguageCodes();
            $scope.GlobalData = GlobalData;


            var unbind = $rootScope.$on('cart:updated', function(eve, eveObj){
                $scope.cart = eveObj;
            });

            $scope.$on('$destroy', unbind);

			$scope.switchLanguage = function(languageCode) {
				$translate.use(languageCode);
				$scope.languageCode = GlobalData.languageCode = languageCode;
			};

            /** Toggles the "show cart view" state as the cart icon is clicked. Note that this is the
             * actual cart details display, not the icon. */
            $scope.toggleCart = function (){
                $rootScope.showCart=!$rootScope.showCart;
            };

            /** Toggles the navigation menu for the mobile view. */
            $scope.toggleOffCanvas = function(){
                $rootScope.showMobileNav = !$rootScope.showMobileNav;

            };

	}]);