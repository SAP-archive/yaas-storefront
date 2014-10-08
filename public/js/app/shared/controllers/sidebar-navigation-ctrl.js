'use strict';

angular.module('ds.shared')
     /** Handles interactions in the navigation side bar.   */

	.controller('SidebarNavigationCtrl', ['$scope', '$state', '$stateParams', '$rootScope','$translate', 'GlobalData',
        'storeConfig', 'i18nConstants', 'CookieSvc', 'AuthSvc', 'AuthDialogManager','CategorySvc',

		function ($scope, $state, $stateParams, $rootScope, $translate, GlobalData, storeConfig, i18nConstants,
                  CookieSvc, AuthSvc, AuthDialogManager, CategorySvc) {

            $scope.languageCode = GlobalData.languageCode;
            $scope.languageCodes = i18nConstants.getLanguageCodes();
            $scope.GlobalData = GlobalData;
            $scope.currencySymbol = GlobalData.getCurrencySymbol();
            $scope.isAuthenticated = AuthSvc.isAuthenticated;
            $scope.user = GlobalData.user;
            $scope.categories = [];

            CategorySvc.getCategories().then(function(categories){
                $scope.categories = categories;
            });

            $scope.switchCurrency = function (currency) {
                GlobalData.storeCurrency = currency;

                $state.transitionTo($state.current, $stateParams, {
                    reload: true,
                    inherit: true,
                    notify: true
                });

                CookieSvc.setCurrencyCookie(currency);
            };

            $scope.switchLanguage = function(languageCode) {
                $translate.use(languageCode);
                $scope.languageCode =  languageCode;
                GlobalData.languageCode = languageCode;
                GlobalData.acceptLanguages = (languageCode === storeConfig.defaultLanguage ? languageCode : languageCode+ ';q=1,'+storeConfig.defaultLanguage+';q=0.5');

                if($state.is('base.category') || $state.is('base.product.detail')) {

                    $state.transitionTo($state.current, $stateParams, {
                        reload: true,
                        inherit: true,
                        notify: true
                    });
                }
                CookieSvc.setLanguageCookie(languageCode);
            };

            $scope.logout = function () {
                AuthSvc.signOut();
            };
            
            $scope.login = function(dOpts, opts) {
                AuthDialogManager.open(dOpts, opts);
            };

            $scope.myAccount = function() {
                $state.go('base.account');
                $scope.hideMobileNav();
            };


            var unbind = $rootScope.$on('language:switch', function (eve, languageCode) {
                $scope.switchLanguage(languageCode);
            });

            $scope.$on('$destroy', unbind);
            
            $scope.hideMobileNav = function(){
                $rootScope.showMobileNav = false;

            };

	}]);