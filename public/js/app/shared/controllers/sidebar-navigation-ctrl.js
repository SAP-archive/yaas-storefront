/**
 * [y] hybris Platform
 *
 * Copyright (c) 2000-2015 hybris AG
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of hybris
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with hybris.
 */

'use strict';

angular.module('ds.shared')
/** Handles interactions in the navigation side bar.   */


    .controller('SidebarNavigationCtrl', ['$scope', '$state', '$stateParams', '$rootScope', 'GlobalData',
        'i18nConstants', 'AuthSvc', 'AuthDialogManager','CategorySvc', '$translate', '$q', 'settings',

        function ($scope, $state, $stateParams, $rootScope, GlobalData, i18nConstants,
                  AuthSvc, AuthDialogManager, CategorySvc, $translate, $q, settings) {

            $scope.tenantId = GlobalData.store.tenant;

            // determines "sign-in" link in sidebar
            $scope.isAuthenticated = AuthSvc.isAuthenticated;

            $scope.user = GlobalData.user;
            $scope.categories = CategorySvc.getCategoriesFromCache();

            // binds logo in sidebar
            $scope.store = GlobalData.store;


            $scope.localeImages = settings.localeImages;

            var unbindCats = $rootScope.$on('categories:updated', function(eve, obj){
                if(!$scope.categories || obj.source === settings.eventSource.languageUpdate){
                    $scope.categories = obj.categories;
                }
            });



            $scope.$on('$destroy', unbindCats);

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
