'use strict';

angular.module('ds.shared')
     /** Handles interactions in the navigation side bar.   */

	.controller('SidebarNavigationCtrl', ['$scope', '$state', '$stateParams', '$rootScope', 'GlobalData',
        'i18nConstants', 'AuthSvc', 'AuthDialogManager','CategorySvc',

		function ($scope, $state, $stateParams, $rootScope, GlobalData, i18nConstants,
                  AuthSvc, AuthDialogManager, CategorySvc) {

            $scope.languageCode = GlobalData.languageCode;
            $scope.languageCodes = i18nConstants.getLanguageCodes();
            $scope.GlobalData = GlobalData;
            $scope.currencySymbol = GlobalData.getCurrencySymbol();
            $scope.isAuthenticated = AuthSvc.isAuthenticated;
            $scope.user = GlobalData.user;
            $scope.categories = [];

            CategorySvc.getCategories().then(function(categories){
                $scope.categories = categories;d
            });

            $scope.switchCurrency = function (currency) {
                GlobalData.setCurrency(currency);
                $state.transitionTo($state.current, $stateParams, {
                    reload: true,
                    inherit: true,
                    notify: true
                });
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