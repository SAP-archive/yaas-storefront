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


            function refreshDataOnLanguageChange(){
                if($state.is('base.product.detail')) {
                    $state.transitionTo($state.current, $stateParams, {
                        reload: true,
                        inherit: true,
                        notify: true
                    });
                }
            }

            function switchCurrency(currencyId) {
                GlobalData.setCurrency(currencyId);
                if($state.is('base.category') || $state.is('base.product.detail') || $state.is('base.checkout.details')) {
                    $state.transitionTo($state.current, $stateParams, {
                        reload: true,
                        inherit: true,
                        notify: true
                    });
                }
            }

            $scope.$watch('language.selected', function(newValue, oldValue) {
                if (!angular.equals(newValue, oldValue) && newValue.iso) {
                    GlobalData.setLanguage(newValue.iso);
                }
            });

            $scope.$watch('currency.selected', function(newValue, oldValue) {
                if (!angular.equals(newValue, oldValue) && newValue.id) {
                    switchCurrency(newValue.id);
                }
            });


            // handling currency updates initiated from outside this controller
            var unbindCurrency = $rootScope.$on('currency:updated', function (eve, currencyId) {
                if(currencyId !== $scope.currency.id){
                    $scope.currency.selected = GlobalData.getCurrencyById(currencyId);
                }
            });

            // handling language updates initiated from outside this controller
            var unbindLang = $rootScope.$on('language:updated', function (eve, newLangCode) {
                if(newLangCode !== $scope.language.selected.iso){
                    $scope.language.selected =  { iso: newLangCode, value: newLangCode };
                }
                refreshDataOnLanguageChange();
            });

            var unbindCat = $rootScope.$on('categories:updated', function(eve, obj){
                if(!$scope.categories || obj.source === 'language:updated'){
                    $scope.categories = obj.categories;
                }
            });

            $scope.$on('$destroy', unbindCurrency, unbindLang, unbindCat);

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
