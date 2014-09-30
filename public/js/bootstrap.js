'use strict';

// Bootstrap the application for single tenant mode
(function () {

    var storeConfig = {};

    storeConfig.storeTenant = '8bwhetym79cq';

    // acts as fallback language for localization
    // Longterm, will be retrieved via service from admin tool configuration
    storeConfig.defaultLanguage = 'en';
    storeConfig.defaultCurrency = 'USD';
    storeConfig.defaultCurrencySymbol = '$';

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
