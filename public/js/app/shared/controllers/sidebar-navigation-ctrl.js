'use strict';

angular.module('ds.shared')
/** Handles interactions in the navigation side bar.   */


    .controller('SidebarNavigationCtrl', ['$scope', '$state', '$stateParams', '$rootScope', 'GlobalData',
        'i18nConstants', 'AuthSvc', 'AuthDialogManager','CategorySvc', '$translate', '$q',

        function ($scope, $state, $stateParams, $rootScope, GlobalData, i18nConstants,
                  AuthSvc, AuthDialogManager, CategorySvc, $translate, $q) {

            $scope.currencies = GlobalData.getAvailableCurrencies();
            $scope.currency = { selected: GlobalData.getCurrency() };

            // determines "sign-in" link in sidebar
            $scope.isAuthenticated = AuthSvc.isAuthenticated;

            $scope.user = GlobalData.user;
            $scope.categories = CategorySvc.getCategoriesFromCache();

            // binds logo in sidebar
            $scope.store = GlobalData.store;

            $scope.language = { selected: { iso: GlobalData.getLanguageCode(), value: GlobalData.getLanguageCode() }};
            $scope.languages = [];
            var availableLanguages = GlobalData.getAvailableLanguages();
            var langTransations = availableLanguages.map(function(lang) { return $translate(lang.id); });
            $q.all(langTransations).then(function(response) {
                $scope.languages = availableLanguages.map(function(lang, index) { return { iso:  lang.id, value: response[index] }; });
            });

            var unbindCats = $rootScope.$on('categories:updated', function(eve, obj){
                if(!$scope.categories || obj.source === 'language:updated'){
                    $scope.categories = obj.categories;
                }
            });

            $scope.$watch('language.selected', function(newValue, oldValue) {
                if (!angular.equals(newValue, oldValue) && newValue.iso) {
                    GlobalData.setLanguage(newValue.iso);
                }
            });

            $scope.$watch('currency.selected', function(newValue, oldValue) {
                if (!angular.equals(newValue, oldValue) && newValue.id) {
                    GlobalData.setCurrency(newValue.id);
                }
            });

            // handling currency updates initiated from outside this controller
            var unbindCurrency = $rootScope.$on('currency:updated', function (eve, eveObj) {
                if(eveObj.currencyId !== $scope.currency.id){
                    $scope.currency.selected = GlobalData.getCurrencyById(eveObj.currencyId);
                }
            });

            // handling language updates initiated from outside this controller
            var unbindLang = $rootScope.$on('language:updated', function (eve, eveObj) {
                if(eveObj.languageCode !== $scope.language.selected.iso){
                    $scope.language.selected =  { iso: eveObj.languageCode, value: eveObj.languageCode };
                }
            });

            $scope.$on('$destroy', unbindCurrency, unbindLang, unbindCats);

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
