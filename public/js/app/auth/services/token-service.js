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
 *  Encapsulates management of the OAuth token and user name, using cookies.
 */
angular.module('ds.auth')
    .factory('TokenSvc', ['settings', 'ipCookie', 'appConfig',
        function(settings, ipCookie, appConfig){

        var defaultExpirySeconds = 3599;

        var Token = function(userName, accessToken, tenant) {
            this.userName = userName;
            this.accessToken = accessToken;
            this.tenant = tenant;
            this.getUsername = function(){
                return this.userName;
            };
            this.getAccessToken = function(){
                return this.accessToken;
            };
            this.getTenant = function(){
                return this.tenant;
            };
        };


        var TokenSvc = {

            unsetToken: function() {
                ipCookie.remove(settings.accessCookie);
            },

            /** Sets an anonymous access token, only if there currently is no token. */
            setAnonymousToken: function(accessToken, expiresIn) {
                if(!this.getToken().getAccessToken() || this.getToken().getTenant() !== appConfig.storeTenant()) {
                   this.setToken(accessToken, null, expiresIn);
                }
            },

            /*
             * Store token as cookie.
             * @param {String} accessToken [OAuth token]
             * @param {String} userName [user name/email; may be null]
             * @param {String} expiresIn [# of seconds the token will expire in; may be null]
             */
            setToken: function(accessToken, userName, expiresIn) {
                var token = new Token(userName, accessToken, appConfig.storeTenant());
                ipCookie(settings.accessCookie, JSON.stringify(token), {expirationUnit: 'seconds', expires: expiresIn ? expiresIn : defaultExpirySeconds});
            },

            /** Returns a Token object with the functions getUsername() and getAccessToken(). */
            getToken: function() {
                var tokenCookie = ipCookie(settings.accessCookie);
                if(tokenCookie ){
                    if(tokenCookie.tenant === appConfig.storeTenant()){
                        return new Token(tokenCookie.userName, tokenCookie.accessToken, tokenCookie.tenant);
                    } else { // existing cookie associated with different tenant - invalidate
                        this.unsetToken();
                    }
                }
                return new Token(null, null, null);
            }

        };

        return TokenSvc;

    }]);