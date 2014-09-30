/**
 * [y] hybris Platform
 *
 * Copyright (c) 2000-2014 hybris AG
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
angular.module('ds.auth')
    .factory('AnonAuthSvc', ['TokenSvc', '$http', '$rootScope', 'GlobalData', 'settings', function (TokenSvc, $http, $rootScope, GlobalData, settings) {

        function getParameterByName(name, url) {
            name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
            var regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
                results = regex.exec(url);
            return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
        }



        var inProgress = false;
        return {

            /** Handles request to obtain anonymous token and store it in the cookie.
             * If request already in progress, does nothing.
             */
            getToken: function(){

                if(!inProgress) {
                    inProgress = true;
                    $http.post(settings.apis.account.baseUrl + '/auth/anonymous/login?hybris-tenant=' + GlobalData.store.tenant, '').then( function(data){
                        var token = getParameterByName('access_token', data.headers('Location'));
                        var expiresIn = parseInt(getParameterByName('expires_in', data.headers('Location')));
                        TokenSvc.setAnonymousToken(token, expiresIn);
                        inProgress = false;
                        $rootScope.$emit('authtoken:obtained', token);
                    }, function(error){
                        inProgress = false;
                        console.error('Unable to perform anonymous login:');
                        console.error(error);
                    });
                }
            }
        };


    }]);