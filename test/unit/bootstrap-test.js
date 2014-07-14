'use strict';


// Bootstrap the application
(function() {
    var initInjector = angular.injector(['ng']);

            angular.module('config', []).constant('STORE_CONFIG', {'storeTenant':'testTenant'});

            angular.element(document).ready(function() {
                angular.bootstrap(document, [
                    'ds.router', 'config']);

            });

})();
