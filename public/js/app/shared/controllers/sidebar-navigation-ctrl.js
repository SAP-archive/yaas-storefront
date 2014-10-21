'use strict';

angular.module('ds.shared')
/** Handles interactions in the navigation side bar.   */


    .controller('SidebarNavigationCtrl', ['$scope', '$state', '$stateParams', '$rootScope', 'GlobalData',
        'i18nConstants', 'AuthSvc', 'AuthDialogManager','CategorySvc',

        function ($scope, $state, $stateParams, $rootScope, GlobalData, i18nConstants,
                  AuthSvc, AuthDialogManager, CategorySvc) {

            $scope.isAuthenticated = AuthSvc.isAuthenticated;
            $scope.user = GlobalData.user;
            $scope.categories = [];

            function loadCategories(){
                CategorySvc.getCategories().then(function(categories){
                    $scope.categories = categories;
                });
            }

            loadCategories();

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
                if($state.is('base.category') || $state.is('base.product.detail')) {

                    $state.transitionTo($state.current, $stateParams, {
                        reload: true,
                        inherit: true,
                        notify: true
                    });
                } else {
                    loadCategories();
                }
            };


            // handling language updates initiated from outside this controller
            var unbindLang = $rootScope.$on('language:updated', function (eve, eveObj) {
                $scope.switchLanguage(eveObj);
            });


            // handling currency updates initiated from outside this controller
            var unbindCurr = $rootScope.$on('currency:updated', function (eve, eveObj) {
                $scope.switchLanguage(eveObj);
            });

            $scope.$on('$destroy', unbindCurr, unbindLang);

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