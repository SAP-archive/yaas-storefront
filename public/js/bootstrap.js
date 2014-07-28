'use strict';


// Bootstrap the application
(function() {
    var initInjector = angular.injector(['ng']);
    var $http = initInjector.get('$http');
    $http.get('storeconfig').then(
        function (response) {
            angular.module('config', []).constant('STORE_CONFIG', response.data);


            angular.element(document).ready(function() {
                angular.bootstrap(document, [
                    'ds.router', 'config']);

            });
        },
        function(error){
            console.error('Unable to to load bootstrap store config:');
            console.error(error);
        }
    );
})();
