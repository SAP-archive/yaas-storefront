
'use strict';

angular.module('ds.queue', [])
    .factory('httpQueue', ['$injector', function($injector) {


        /** Holds all the "blocked" requests, so they can be re-requested in future. */
        var blockedBuffer = [];
        var rejectedBuffer = [];
        var authHeader = 'Authorization';
        /** Service initialized later because of circular dependency problem. */
        var $http;

        /** Submit requests that were never sent because of missing token.*/
        function retryBlockedHttpRequest(config, deferred) {
            deferred.resolve(config);
        }

        /** Resubmit requests that resulted in 401 due to rejected token.*/
        function retryRejectedHttpRequest(config, deferred) {
            function successCallback(response) {
                deferred.resolve(response);
            }

            function errorCallback(response) {
                deferred.reject(response);
            }

            $http = $http || $injector.get('$http');
            $http(config).then(successCallback, errorCallback);
        }

        function setToken(config, token){
            config.headers[authHeader] = 'Bearer ' + token;
        }

    return {
        /**
         * Appends HTTP request configuration object with deferred response -
         * use for requests that were never sent due to missing token.
         */
        appendBlocked: function (config, deferred) {
            blockedBuffer.push({
                config: config,
                deferred: deferred
            });
        },

        /**
         * Appends HTTP request configuration object with deferred response -
         * use for requests that were rejected by the service due to an invalid token.
         */
        appendRejected: function (config, deferred) {
            rejectedBuffer.push({
                config: config,
                deferred: deferred
            });
        },

        /**
         * Abandon or reject (if reason provided) all the buffered requests.

        rejectAll: function (reason) {
            if (reason) {
                for (var i = 0; i < buffer.length; ++i) {
                    buffer[i].deferred.reject(reason);
                }
            }
            buffer = [];
        },*/

        /**
         * Retries all the buffered requests clears the buffer.
         * @param new token
         */
        retryAll: function (token) {
            var buff = blockedBuffer;

            for (var i = 0; i < buff.length; ++i) {
                setToken(buff[i].config, token);
                retryBlockedHttpRequest(buff[i].config, buff[i].deferred);
            }
            blockedBuffer = [];
            buff = rejectedBuffer;
            for (i = 0; i < buff.length; ++i) {
                setToken(buff[i].config, token);
                retryRejectedHttpRequest(buff[i].config, buff[i].deferred);
            }
            rejectedBuffer = [];
        }
    };
    }]);