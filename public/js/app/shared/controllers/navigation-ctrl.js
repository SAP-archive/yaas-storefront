'use strict';

angular.module('ds.shared')
     /** Handles interactions in the navigation bar.  Listens to the 'cart:updated' event - on update,
      * the cart icon will reflect the updated cart quantity. */
	.controller('NavigationCtrl', ['$scope', '$state', '$rootScope','$translate', 'GlobalData', 'i18nConstants', 'cart', 'AuthSvc', 'AuthDialogManager', '$stateParams', 'storeConfig',
		function ($scope, $state, $rootScope, $translate, GlobalData, i18nConstants, cart, AuthSvc, AuthDialogManager, $stateParams, storeConfig) {

            $scope.cart = cart;
			$scope.languageCode = GlobalData.languageCode;
            $scope.languageCodes = i18nConstants.getLanguageCodes();
            $scope.GlobalData = GlobalData;
            $scope.isAuthenticated = false;

            $scope.$watch(function() { return AuthSvc.isAuthenticated(); }, function(isAuthenticated) {
                $scope.isAuthenticated = isAuthenticated;
                $scope.username = AuthSvc.getToken().getUsername();
            });

            var ocu = $rootScope.$on('cart:updated', function(eve, eveObj){
                $scope.cart = eveObj;
            });

            $scope.$on('$destroy', function() {
                ocu();
            });

			$scope.switchLanguage = function(languageCode) {
				$translate.use(languageCode);
				$scope.languageCode =  languageCode;
                GlobalData.languageCode = languageCode;
                GlobalData.acceptLanguages = (languageCode === storeConfig.defaultLanguage ? languageCode : languageCode+ ';q=1,'+storeConfig.defaultLanguage+';q=0.5');
                if($state.is('base.product') || $state.is('base.product.detail')) {
                    $state.transitionTo($state.current, $stateParams, {
                        reload: true,
                        inherit: false,
                        notify: true
                    });
                }
			};

            /** Toggles the "show cart view" state as the cart icon is clicked. Note that this is the
             * actual cart details display, not the icon. */
            $scope.toggleCart = function (){
                $rootScope.showCart=!$rootScope.showCart;
            };

            /** Toggles the navigation menu for the mobile view. */
            $scope.toggleOffCanvas = function(){
                $rootScope.showMobileNav = !$rootScope.showMobileNav;

            };

            $scope.isShowCartButton = function() {
                return !$state.is('base.checkout.details') && !$state.is('base.confirmation');
            };

            $scope.isAuthenticated = AuthSvc.isAuthenticated;

            $scope.logout = AuthSvc.signout;
            
            $scope.login = function(dOpts, opts) {
                AuthDialogManager.open(dOpts, opts);
            };

            $scope.myProfile = function() {
                $state.go('base.profile');
            };

	}]);