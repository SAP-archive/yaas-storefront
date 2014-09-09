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
    .factory('TokenSvc', ['settings', 'ipCookie', function(settings, ipCookie){


        var Token = function(userName, accessToken) {
            this.userName = userName;
            this.accessToken = accessToken;
            this.getUsername = function(){
                return this.userName;
            };
            this.getAccessToken = function(){
                return this.accessToken;
            };
        };


        var TokenSvc = {

            unsetToken: function() {
                ipCookie.remove(settings.authTokenKey);
            },

            /**
             * Store token encapsulating logged in user's details into the configured Storage.
             * @param {[type]} authToken [description]
             */
            setToken: function(accessToken, userName) {
                var token = new Token(userName, accessToken);
                ipCookie(settings.authTokenKey, JSON.stringify(token));
            },

            /** Returns a Token object with the functions getUsername() and getAccessToken(). */
            getToken: function() {
                var tokenCookie = ipCookie(settings.authTokenKey);
                return tokenCookie? new Token(tokenCookie.userName, tokenCookie.accessToken) : new Token(null, null);
            }

        };

        return TokenSvc;

    }]);