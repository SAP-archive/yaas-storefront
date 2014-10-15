'use strict';

// Bootstrap the application for single tenant mode
(function () {

    var storeConfig = {};
    storeConfig.storeTenant = 'zfzq82gtrxlj';

    try {
        console.log(storeConfig);
        angular.module('config', []).constant('storeConfig', storeConfig);
        angular.element(document).ready(function () {
            angular.bootstrap(document, [
                'ds.router']);
        });

    } catch (exception) {
        console.error('Unable to invoke angular.bootstrap:');
        console.error(exception);
    }

})();
