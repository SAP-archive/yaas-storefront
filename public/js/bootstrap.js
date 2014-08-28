'use strict';


// Bootstrap the application for single tenant mode
(function () {
    var storeConfig = {};
    storeConfig.storeTenant = 'mrskzfdhlztk';
    // acts as fallback language for localization
    // Longterm, will be retrieved via service from admin tool configuration
    storeConfig.defaultLanguage = 'en';

    angular.module('config', []).constant('storeConfig', storeConfig);

    var initInjector = angular.injector(['ng']);
    var $http = initInjector.get('$http');
    var accountUrl = 'http://demo-eu04-test.apigee.net/test';//'http://account-v1.test.cf.hybris.com'; //'';
    $http.post(accountUrl+'/auth/anonymous/login?hybris-tenant='+storeConfig.storeTenant, '')
        .then(
        function (response) {
          console.log("login success");
            console.log($http.headers);
        },
        function(error){
            console.error('Unable to peform anonymous login:');
            console.error(error);
        }
    );

    angular.module('config').constant('sessionConfig', {})
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
