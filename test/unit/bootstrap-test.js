'use strict';


// Bootstrap the application
(function() {
    var initInjector = angular.injector(['ng']);

            angular.module('config', []).constant('storeConfig', {'storeTenant':'testTenant', defaultLanguage: 'en', defaultCurrency: 'USD'});

            angular.element(document).ready(function() {
                angular.bootstrap(document, [
                    'ds.router']);

            });

})();
