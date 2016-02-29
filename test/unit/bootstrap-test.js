'use strict';


// Bootstrap the application
(function () {
    var initInjector = angular.injector(['ng']);

    angular.module('config', []).constant('appConfig', { 'storeTenant': 'testTenant', defaultLanguage: 'en', defaultCurrency: 'USD' });

    angular.element(document).ready(function () {
        angular.bootstrap(document, [
            'ds.app']);

    });

    // Fix for problem with trying to get JSON translation files
    beforeEach(module('pascalprecht.translate'));
    // overriding of translate loader (otherwise it throws errors that http GET is unexpected)
    beforeEach(module(function ($translateProvider) {
        $translateProvider.useStaticFilesLoader = function () {
        };
    }));
})();
