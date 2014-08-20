'use strict';


// Bootstrap the application for multi-tenant mode.
// Requires a service call to load the basic store information.
(function() {
    var initInjector = angular.injector(['ng']);
    var $http = initInjector.get('$http');
    $http.get('storeconfig').then(
        function (response) {
            // HARD-CODED DEFAULT LANGUAGE - will be replaced by service that can read from admin settings
            response.data.defaultLanguage = 'en;'
            angular.module('config', []).constant('storeConfig', response.data);

            try {
                angular.element(document).ready(function () {
                    angular.bootstrap(document, [
                        'ds.router']);

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
