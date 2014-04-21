'use strict';

angular.module('ds.shared')
	.controller('NavigationCtrl', ['$scope', '$rootScope', '$translate', 'GlobalData', 'i18nConstants',
		function ($scope, $rootScope, $translate, GlobalData, i18nConstants) {

			$scope.languageCode = GlobalData.languageCode;
            $scope.languageCodes = i18nConstants.getLanguageCodes();
            
			$scope.switchLanguage = function(languageCode) {
				$translate.use(languageCode);
				$scope.languageCode = GlobalData.languageCode = languageCode;
			};

            $rootScope.showCart = false;

            $scope.toggleCart = function (){
                $rootScope.showCart=!$rootScope.showCart;
                $scope.$emit('cart.toggle', $rootScope.showCart);
            };

	}]);