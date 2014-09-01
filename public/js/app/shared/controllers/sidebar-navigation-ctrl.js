'use strict';

angular.module('ds.shared')
     /** Handles interactions in the navigation side bar.   */
	.controller('SidebarNavigationCtrl', ['$scope', '$state', '$stateParams', '$rootScope','$translate', 'GlobalData', 'storeConfig', 'i18nConstants', 'AuthSvc', 'AuthDialogManager',

		function ($scope, $state, $stateParams, $rootScope, $translate, GlobalData, storeConfig, i18nConstants, AuthSvc, AuthDialogManager) {

            $scope.languageCode = GlobalData.languageCode;
            $scope.languageCodes = i18nConstants.getLanguageCodes();
            $scope.GlobalData = GlobalData;
            $scope.isAuthenticated = AuthSvc.isAuthenticated;

            $scope.$watch(function() { return AuthSvc.isAuthenticated(); }, function(isAuthenticated) {
                $scope.isAuthenticated = isAuthenticated;
                $scope.username = AuthSvc.getToken().getUsername();
            });

            $scope.switchLanguage = function(languageCode) {
                $translate.use(languageCode);
                $scope.languageCode =  languageCode;
                GlobalData.languageCode = languageCode;
                GlobalData.acceptLanguages = (languageCode === storeConfig.defaultLanguage ? languageCode : languageCode+ ';q=1,'+storeConfig.defaultLanguage+';q=0.5');

                if($state.is('base.product') || $state.is('base.product.detail')) {

                    $state.transitionTo($state.current, $stateParams, {
                        reload: true,
                        inherit: true,
                        notify: true
                    });
                }
            };

            $scope.logout = function() {
                AuthSvc.signout();
            };
            
            $scope.login = function(dOpts, opts) {
                AuthDialogManager.open(dOpts, opts);
            };

            $scope.myProfile = function() {
                $state.go('base.profile');
            };
	}]);