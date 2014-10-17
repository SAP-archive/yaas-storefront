'use strict';

angular.module('ds.shared')
     /** Handles interactions in the navigation side bar.   */


	.controller('SidebarNavigationCtrl', ['$scope', '$state', '$stateParams', '$rootScope', 'GlobalData',
        'i18nConstants', 'AuthSvc', 'AuthDialogManager','CategorySvc',

		function ($scope, $state, $stateParams, $rootScope, GlobalData, i18nConstants,
                  AuthSvc, AuthDialogManager, CategorySvc) {

            $scope.languageCodes = i18nConstants.getLanguageCodes();

            $scope.currencySymbol = GlobalData.getCurrencySymbol();
            $scope.currencies = GlobalData.getAvailableCurrencies();
            $scope.currency = { selected: GlobalData.getCurrency() };

            $scope.isAuthenticated = AuthSvc.isAuthenticated;
            $scope.user = GlobalData.user;
            $scope.categories = [];

            $scope.language = { selected: { iso: GlobalData.getLanguageCode(), value: GlobalData.getLanguageCode() }};
            $scope.languages = $scope.languageCodes.map(function(lang) { return { iso:  lang, value: lang }; });

            $scope.$watch('language.selected', function(newValue, oldValue) {
                if (!angular.equals(newValue, oldValue) && newValue.iso) {
                    $scope.switchLanguage(newValue.iso);
                }
            });

            $scope.$watch('currency.selected', function(newValue, oldValue) {

                if (!angular.equals(newValue, oldValue) && newValue.id) {
                    $scope.switchCurrency(newValue.id);
                }
            });

            CategorySvc.getCategories().then(function(categories){
                $scope.categories = categories;
            });

            // handling currency updates initiated from outside this controller
            var unbindCurrency = $rootScope.$on('currency:updated', function (eve, eveObj) {
                if(eveObj.id !== $scope.currency.id){
                    $scope.currency.selected = eveObj;
                }
            });

            // handling language updates initiated from outside this controller
            var unbindLang = $rootScope.$on('language:updated', function (eve, eveObj) {
                if(eveObj !== $scope.language.iso){
                    $scope.language.selected =  { iso: $scope.eveObj, value: $scope.eveObj };
                }
            });

            $scope.$on('$destroy', unbindCurrency, unbindLang);

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

                GlobalData.setLanguage(languageCode);

                if($state.is('base.category') || $state.is('base.product.detail') || $state.is('base.account')) {

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

            $scope.hideMobileNav = function(){
                $rootScope.showMobileNav = false;
            };

            $scope.myAccount = function() {
                $state.go('base.account');
                $scope.hideMobileNav();
            };

	}]);