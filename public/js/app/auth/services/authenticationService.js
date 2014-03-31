'use strict';

angular.module('hybris.bs&d.newborn.auth.services.authentication', [])
    .factory('AuthenticationService', ['$rootScope', '$q',
        function($rootScope, $q) {

            var AuthenticationService = {

                /**
                 * Authentication method used for signing the user in.
                 * @param  {String} username 
                 * @param  {String} password 
                 * @return {$q.promise}          promise object
                 */
                authenticate: function(username, password) {
                    console.log('authentication', username, password);
                    var deferred = $q.defer();

                    // Faked authentcation - for now user is always authenticated
                    setTimeout(function() {
                        var mockedResponse = { username: username };
                        // Loose couple
                        $rootScope.$broadcast('signin:success', mockedResponse);
                        deferred.resolve(mockedResponse);
                    }, 500);

                    return deferred.promise;
                }

            };

            return AuthenticationService;
        }
    ]);
