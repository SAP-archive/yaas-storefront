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

/**  Initializes and configures the application. */
window.app = angular.module('ds.app', [
    'restangular',
    'ui.router',
    'ds.shared',
    'ds.security',
    'ds.i18n',
    'ds.home',
    'ds.products',
    'ds.cart',
    'ds.checkout',
    'ds.confirmation',
    'ds.coupon',
    'ds.account',
    'ds.addresses',
    'ds.auth',
    'ds.orders',
    'ds.queue',
    'ds.router',
    'ds.httpproxy',
    'ds.errors',
    'ds.backendMock',
    'xeditable',
    'ngSanitize',
    'ui.select',
    'ui-notification',
    'ds.ybreadcrumb',
    'ds.ytracking',
    'ds.localstorage',
    'ds.appconfig',
    'ds.searchlist',
    'ds.ysearch'
])
    .constant('_', window._)

    // Configure HTTP and Restangular Providers - default headers, CORS
    .config(['$httpProvider', 'RestangularProvider', 'settings', 'appConfig',
        function ($httpProvider, RestangularProvider, settings, appConfig) {
        $httpProvider.interceptors.push('interceptor');

        // enable CORS
        $httpProvider.defaults.useXDomain = true;
        RestangularProvider.addFullRequestInterceptor( function(element, operation, route, url, headers, params, httpConfig) {

            var oldHeaders = {};
            if(url.indexOf('yaas') < 0) {
                delete $httpProvider.defaults.headers.common[settings.headers.hybrisAuthorization];
                //work around if not going through Apigee proxy for a particular URL, such as while testing new services
                oldHeaders [settings.headers.hybrisTenant] = appConfig.storeTenant();
                oldHeaders [settings.headers.hybrisRoles] = settings.roleSeller;
                oldHeaders [settings.headers.hybrisUser] = settings.hybrisUser;
                oldHeaders [settings.headers.hybrisApp] = settings.hybrisApp;
            }
            return {
                element: element,
                params: params,
                headers: _.extend(headers, oldHeaders),
                httpConfig: httpConfig
            };
        });
    }])

    .run(['$rootScope', '$injector','ConfigSvc', 'AuthDialogManager', '$location', 'settings', 'TokenSvc',
       'AuthSvc', 'GlobalData', '$state', 'httpQueue', 'editableOptions', 'editableThemes', 'CartSvc', 'EventSvc',
        function ($rootScope, $injector, ConfigSvc, AuthDialogManager, $location, settings, TokenSvc,
                 AuthSvc, GlobalData, $state, httpQueue, editableOptions, editableThemes, CartSvc, EventSvc) {

            //closeOffcanvas func for mask
            $rootScope.closeOffcanvas = function(){
                $rootScope.showMobileNav = false;
                $rootScope.showCart = false;
            };

            editableOptions.theme = 'bs3';
            editableThemes.bs3.submitTpl = '<button type="submit" class="btn btn-primary">{{\'SAVE\' | translate}}</button>';

            $rootScope.$on('authtoken:obtained', function(event, token){
                httpQueue.retryAll(token);
            });

            $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState){
                AuthDialogManager.close();
                var needsAuthentication = toState.data && toState.data.auth && toState.data.auth === 'authenticated';
                toState.repeat = false;

                if ( needsAuthentication && !AuthSvc.isAuthenticated() ) {
                    // block immediate state transition
                    event.preventDefault();
                    if(!fromState.name){
                        $state.go(settings.homeState);
                    }

                   var dlg = $injector.get('AuthDialogManager').open({windowClass:'mobileLoginModal'}, {}, {}, false);
                   dlg.then(function(){
                            $state.go(toState, toParams);
                        },
                        function(){
                            $state.go(settings.homeState);
                    });
                }
            });

            $rootScope.$on('$stateChangeSuccess', function(){
                $rootScope.$emit('cart:closeNow');
            });

            // Implemented as watch, since client-side determination of "logged" in depends on presence of token in cookie,
            //   which may be removed by browser/user
            $rootScope.$watch(function () {
                return AuthSvc.isAuthenticated();
            }, function (isAuthenticated, wasAuthenticated) {
                $rootScope.$broadcast(isAuthenticated ? 'user:signedin' : 'user:signedout', {new: isAuthenticated, old: wasAuthenticated});
                GlobalData.user.isAuthenticated = isAuthenticated;
            });

            $rootScope.$on('site:updated', function () {
                EventSvc.onSiteChange();
            });

            $rootScope.$on('language:updated', function (event, eveObj) {
                EventSvc.onLanguageChange(event, eveObj);
            });

            // setting root scope variables that drive class attributes in the BODY tag
            $rootScope.showCart =false;
            $rootScope.showMobileNav=false;
        }

    ]);


