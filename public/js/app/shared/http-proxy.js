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

angular.module('ds.http-proxy', [])

       /** Defines the HTTP interceptors. */
    .factory('interceptor', ['$q', '$injector', 'settings','TokenSvc', 'httpQueue', 'GlobalData', 'SiteConfigSvc',
        function ($q, $injector, settings,  TokenSvc, httpQueue, GlobalData, siteConfig) {

            return {
                request: function (config) {
                    document.body.style.cursor = 'wait';
                    // skip html requests as well as anonymous login URL
                    if (config.url.indexOf('templates') < 0 && config.url.indexOf(siteConfig.apis.account.baseUrl) < 0) {

                        var token = TokenSvc.getToken().getAccessToken();
                        if (token) {
                            config.headers[settings.headers.hybrisAuthorization] = 'Bearer ' + token;
                        } else {
                            // no local token - issue request to get token (async) and "save" http request for re-try
                            $injector.get('AnonAuthSvc').getToken();
                            var deferred = $q.defer();
                            httpQueue.appendBlocked(config, deferred);
                            return deferred.promise;
                        }
                    }
                    return config || $q.when(config);
                },
                requestError: function(request){
                    document.body.style.cursor = 'auto';
                    return $q.reject(request);
                },
                response: function (response) {
                    document.body.style.cursor = 'auto';
                    return response || $q.when(response);
                },
                responseError: function (response) {
                    document.body.style.cursor = 'auto';

                    if (response.status === 401) {
                        // 401 on login means wrong password - requires user action
                        if(response.config.url.indexOf('login')<0 && response.config.url.indexOf('password/change')<0) {
                            // remove any existing token, as it appears to be invalid
                            TokenSvc.unsetToken();
                            var $state = $injector.get('$state');
                            // if current state requires authentication, prompt user to sign in and reload state
                            if ($state.current.data && $state.current.data.auth && $state.current.data.auth === 'authenticated') {
                                $injector.get('AuthDialogManager').open({}, {}, {});
                            } else {
                                // else, retry http request - new anonymous token will be triggered automatically
                                // issue request to get token (async) and "save" http request
                                $injector.get('AnonAuthSvc').getToken();
                                var deferred = $q.defer();
                                httpQueue.appendRejected(response.config, deferred);
                                return deferred.promise;
                            }
                        } else if ( response.config.url.indexOf('login') < 0 && response.config.url.indexOf('password/change') < 0){
                            // show error view
                            $injector.get('$state').go('errors', { errorId : '401' });
                        }

                    } else if(response.status === 403){
                        // if 403 during login, should already be handled by auth dialog controller
                        if(response.config.url.indexOf('login')<0) {
                            // using injector lookup to prevent circular dependency
                            var AuthSvc = $injector.get('AuthSvc');
                            if (AuthSvc.isAuthenticated()) {
                                // User is authenticated but is not allowed to access resource
                                // this scenario shouldn't happen, but if it does, don't fail silently
                                window.alert('You are not authorized to access this resource!');
                            } else {
                                // User is not authenticated - make them log in and reload the current state
                                $injector.get('AuthDialogManager').open({}, {}, {}).then(
                                    // success scenario handled as part of "logged in" workflow
                                    function(){},
                                function(){ // on dismiss, re-route to home page
                                    $injector.get('$state').go(settings.homeState);
                                });
                            }
                        }
                    } else if(response.status === 404 && response.config.url.indexOf('cart') < 0 && response.config.url.indexOf('login') < 0 ){
                        $injector.get('$state').go('errors', { errorId : '404' });
                    } else if(response.status === 500){
                        //show error view with default message.
                        $injector.get('$state').go('errors');
                    }
                    return $q.reject(response);
                }
            };
        }]);


