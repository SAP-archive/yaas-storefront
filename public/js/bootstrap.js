'use strict';


// Bootstrap the application
(function() {
    var initInjector = angular.injector(['ng']);
    var $http = initInjector.get('$http');
    $http.get('storeconfig').then(
        function (response) {
            angular.module('config', []).constant('STORE_CONFIG', response.data);

            try {
                angular.element(document).ready(function () {
                    angular.bootstrap(document, [
                        'ds.router', 'config']);

                });
            } catch (exception) {
                console.error('Unable to invoke angular.bootstrap:');
                console.error(exception);
            }
        },
        function(error){
            console.error('Unable to to load hybris bootstrap store config:');
            console.error(error);
        }
    );
})();
