'use strict';

angular.module('ds.shared')
     /** Handles interactions in the navigation bar.   */
	.controller('NavigationCtrl', ['$scope', '$state', '$rootScope','$translate', 'GlobalData', 'i18nConstants',

		function ($scope, $state, $rootScope, $translate, GlobalData, i18nConstants) {

			$scope.languageCode = GlobalData.languageCode;
            $scope.languageCodes = i18nConstants.getLanguageCodes();
            $scope.GlobalData = GlobalData;

			$scope.switchLanguage = function(languageCode) {
				$translate.use(languageCode);
				$scope.languageCode = GlobalData.languageCode = languageCode;
			};

	}]);