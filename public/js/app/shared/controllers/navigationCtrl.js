'use strict';

angular.module('hybris.bs&d.newborn.shared')
	.controller('NavigationCtrl', ['$scope', '$translate', 'GlobalData', 'i18nConstants',
		function ($scope, $translate, GlobalData, i18nConstants) {

			$scope.languageCode = GlobalData.languageCode;
            $scope.languageCodes = i18nConstants.getLanguageCodes();
            
			$scope.switchLanguage = function(languageCode) {
				$translate.use(languageCode);
				$scope.languageCode = GlobalData.languageCode = languageCode;
			};

	}]);