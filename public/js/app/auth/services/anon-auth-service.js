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

/**
 *  Encapsulates access to the account service for anonymous login/OAuth token retrieval.
 */
/* jshint ignore:start */
angular.module('ds.auth')
    .factory('AnonAuthSvc', ['TokenSvc', '$http', '$state', '$rootScope', '$translate', 'GlobalData', 'SiteConfigSvc',
        function (TokenSvc, $http, $state, $rootScope, $translate, GlobalData, siteConfig) {

            var inProgress = false;
            return {

                /** Handles request to obtain anonymous token and store it in the cookie.
                 * If request already in progress, does nothing.
                 */
                getToken: function () {

                    if (!inProgress) {
                        inProgress = true;

                        $http({
                            url: siteConfig.apis.customerlogin.baseUrl + '/auth/anonymous/login',
                            method: 'POST',
                            data: {
                                clientId: GlobalData.store.clientId,
                                tenant: GlobalData.store.tenant
                            }
                        }).then(function (response) {
                            var token = response.data.access_token;
                            var expiresIn = response.data.expires_in;
                            TokenSvc.setAnonymousToken(token, expiresIn);
                            inProgress = false;
                            $rootScope.$emit('authtoken:obtained', token);
                        }, function (error) {
                            inProgress = false;
                            console.error('Unable to perform anonymous login - ensure project id is configured correctly.');
                            $state.go('errors', { errorId: 404 });
                        });
                    }
                }
            };
        }]);
/* jshint ignore:end */