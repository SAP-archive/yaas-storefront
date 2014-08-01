'use strict';


// Bootstrap the application for single tenant mode
(function () {
    var storeConfig = {};
    storeConfig.storeTenant = 'drtxv9ynhrch';
    angular.module('config', []).constant('storeConfig', storeConfig);

    try {
        angular.element(document).ready(function () {
            angular.bootstrap(document, [
                'ds.router']);
        });
    } catch (exception) {
        console.error('Unable to invoke angular.bootstrap:');
        console.error(exception);
    }

})();
