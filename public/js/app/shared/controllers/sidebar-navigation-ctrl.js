'use strict';

angular.module('ds.shared')
     /** Handles interactions in the navigation side bar.   */
	.controller('SidebarNavigationCtrl', ['$scope', '$state', '$stateParams', '$rootScope','$translate', 'GlobalData', 'storeConfig', 'i18nConstants', 'LanguageCookieSvc', 'AuthSvc', 'AuthDialogManager',

		function ($scope, $state, $stateParams, $rootScope, $translate, GlobalData, storeConfig, i18nConstants, LanguageCookieSvc, AuthSvc, AuthDialogManager) {

            $scope.languageCode = GlobalData.languageCode;
            $scope.languageCodes = i18nConstants.getLanguageCodes();
            $scope.GlobalData = GlobalData;
            $scope.isAuthenticated = AuthSvc.isAuthenticated;
            $scope.user = GlobalData.user;

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

                LanguageCookieSvc.setLanguageCookie(languageCode);
            };

            $scope.logout = function () {
                AuthSvc.signOut();
            };
            
            $scope.login = function(dOpts, opts) {
                AuthDialogManager.open(dOpts, opts);
            };

            $scope.myAccount = function() {
                $state.go('base.account');
            };


            var unbind = $rootScope.$on('language:switch', function (eve, languageCode) {
                $scope.switchLanguage(languageCode);
            });

            $scope.$on('$destroy', unbind);
            
            $scope.showProducts = function(){
                $rootScope.showMobileNav = false;
                $state.go('base.product');
            };

	}]);