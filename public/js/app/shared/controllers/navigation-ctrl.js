'use strict';

angular.module('ds.shared')

	.controller('NavigationCtrl', ['$scope', '$rootScope','$translate', 'GlobalData', 'i18nConstants', 'cart',

		function ($scope, $rootScope, $translate, GlobalData, i18nConstants, cart) {

            $scope.cart = cart;
			$scope.languageCode = GlobalData.languageCode;
            $scope.languageCodes = i18nConstants.getLanguageCodes();


            var unbind = $rootScope.$on('cart:updated', function(eve, eveObj){
                $scope.cart = eveObj;
            });

            $scope.$on('$destroy', unbind);
            
			$scope.switchLanguage = function(languageCode) {
				$translate.use(languageCode);
				$scope.languageCode = GlobalData.languageCode = languageCode;
			};

            $scope.toggleCart = function (){
                $rootScope.showCart=!$rootScope.showCart;
            };

            $scope.toggleOffCanvas = function(){
                $rootScope.showMobileNav = !$rootScope.showMobileNav;

            };

	}]);