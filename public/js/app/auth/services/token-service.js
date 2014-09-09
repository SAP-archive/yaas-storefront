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
 *  Encapsulates cookies based Token Storage service (storing data in cookies).
 */
angular.module('ds.auth')
    .factory('TokenSvc', ['settings', '$cookies', function(settings, $cookies){
        var currentToken = null;

        var TokenSvc = {

            unsetToken: function() {
                delete $cookies[settings.authTokenKey];
            },

            /**
             * Store token encapsulating logged in user's details into the configured Storage.
             * @param {[type]} authToken [description]
             */
            setToken: function(accessToken, username) {
                var token = {};
                token[settings.accessTokenKey] = accessToken || null;
                token[settings.userIdKey] = username || null;

                $cookies[settings.authTokenKey] = JSON.stringify(token);
            },

            getToken: function() {
                var token = $cookies[settings.authTokenKey];
                token = token ? JSON.parse(token) : {};

                token.getUsername = function() {
                    return this[settings.userIdKey];
                };
                token.getAccessToken = function() {
                    return this[settings.accessTokenKey];
                };

                return token;
            }

        };

        return TokenSvc;

    }]);