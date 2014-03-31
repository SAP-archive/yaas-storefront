'use strict';

angular.module('hybris.bs&d.newborn.loader', [])
    
    .config(['$httpProvider', function ($httpProvider) {
        var $http,
            interceptor = ['$q', '$injector', function ($q, $injector) {
                var success = function(response) {
                    // get $http via $injector because of circular dependency problem
                    $http = $http || $injector.get('$http');
                    if($http.pendingRequests.length < 1) {
                        angular.element('#notifications').hide();
                    }
                    return response;
                };

                var error = function(response) {
                    // get $http via $injector because of circular dependency problem
                    $http = $http || $injector.get('$http');
                    if($http.pendingRequests.length < 1) {
                        angular.element('#notifications').hide();
                    }
                    return $q.reject(response);
                };

                return function (promise) {
                    angular.element('#notifications').show();
                    return promise.then(success, error);
                };
            }];

        $httpProvider.responseInterceptors.push(interceptor);
    }]);