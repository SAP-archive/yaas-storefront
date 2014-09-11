
'use strict';
/** Code based on
* @license HTTP Auth Interceptor Module for AngularJS
* (c) 2012 Witold Szczerba
* License: MIT
 */
angular.module('ds.queue', [])
    .factory('httpQueue', ['$injector', function($injector) {


    /** Holds all the requests, so they can be re-requested in future. */
    var buffer = [];

    /** Service initialized later because of circular dependency problem. */
    var $http;



    function retryHttpRequest(config, deferred) {
        /*
        function successCallback(response) {
            deferred.resolve(response);
        }
        function errorCallback(response) {
            deferred.reject(response);
        }
        $http = $http || $injector.get('$http');
        console.log('retry:');
        console.log(config);
        $http(config).then(successCallback, errorCallback);
        */
        deferred.resolve(config);
    }

    return {
        /**
         * Appends HTTP request configuration object with deferred response attached to buffer.
         */
        append: function (config, deferred) {
            buffer.push({
                config: config,
                deferred: deferred
            });
        },

        /**
         * Abandon or reject (if reason provided) all the buffered requests.
         */
        rejectAll: function (reason) {
            if (reason) {
                for (var i = 0; i < buffer.length; ++i) {
                    buffer[i].deferred.reject(reason);
                }
            }
            buffer = [];
        },

        /**
         * Retries all the buffered requests clears the buffer.
         * @param new token
         */
        retryAll: function (token) {
            for (var i = 0; i < buffer.length; ++i) {
                buffer[i].config.headers['Authorization'] = 'Bearer ' + token;
                retryHttpRequest(buffer[i].config, buffer[i].deferred);
            }
            buffer = [];
        }
    };
    }]);