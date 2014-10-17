'use strict';

angular.module('ds.shared')
     /** Handles interactions in the navigation side bar.   */

	.controller('SidebarNavigationCtrl', ['$scope', '$state', '$stateParams', '$rootScope', 'GlobalData',
        'i18nConstants', 'AuthSvc', 'AuthDialogManager','CategorySvc',

		function ($scope, $state, $stateParams, $rootScope, GlobalData, i18nConstants,
                  AuthSvc, AuthDialogManager, CategorySvc) {

            $scope.languageCode = GlobalData.getLanguageCode();
            $scope.languageCodes = i18nConstants.getLanguageCodes();
            $scope.GlobalData = GlobalData;
            $scope.currencySymbol = GlobalData.getCurrencySymbol();
            $scope.isAuthenticated = AuthSvc.isAuthenticated;
            $scope.user = GlobalData.user;
            $scope.categories = [];

            $scope.language = { selected: { iso: $scope.languageCode, value: $scope.languageCode }};
            $scope.languages = $scope.languageCodes.map(function(lang) { return { iso:  lang, value: lang }; });
            $scope.$watch('language.selected', function(newValue, oldValue) {
                if (!angular.equals(newValue, oldValue) && newValue.iso) {
                    $scope.switchLanguage(newValue.iso);
                }
            });

            $scope.currency = { selected: { id: GlobalData.storeCurrency, label: GlobalData.storeCurrency }};
            $scope.currencies = GlobalData.store.currencies;

            $scope.$watch('GlobalData.store.currencies', function() {
                $scope.currencies = GlobalData.store.currencies;
            });
            $scope.$watch('currency.selected', function(newValue, oldValue) {
                if (!angular.equals(newValue, oldValue) && newValue.id) {
                    $scope.switchCurrency(newValue.id);
                }
            });

            CategorySvc.getCategories().then(function(categories){
                $scope.categories = categories;
            });

            $scope.switchCurrency = function (currency) {
                GlobalData.setCurrency(currency);

                if($state.is('base.category') || $state.is('base.product.detail')) {
                    $state.transitionTo($state.current, $stateParams, {
                         reload: true,
                        inherit: true,
                        notify: true
                    });
                }

            };

            $scope.switchLanguage = function(languageCode) {
                $scope.languageCode =  languageCode;
                GlobalData.setLanguage(languageCode);

                if($state.is('base.category') || $state.is('base.product.detail')) {

                    $state.transitionTo($state.current, $stateParams, {
                        reload: true,
                        inherit: true,
                        notify: true
                    });
                }
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

            $scope.hideMobileNav = function(){
                $rootScope.showMobileNav = false;

            };

	}]);