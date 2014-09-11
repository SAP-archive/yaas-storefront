'use strict';


// Bootstrap the application for single tenant mode
(
    function () {
        function getParameterByName(name, url) {
            name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
            var regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
                results = regex.exec(url);
            return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
        }

        var storeConfig = {};
        storeConfig.storeTenant = '3xsfuichdoum';
        // acts as fallback language for localization
        // Longterm, will be retrieved via service from admin tool configuration
        storeConfig.defaultLanguage = 'en';


        var initInjector = angular.injector(['ng']);
        var $http = initInjector.get('$http');

        var accountUrl = 'http://yaas-test.apigee.net/test/account/v1';
        $http.post(accountUrl + '/auth/anonymous/login?hybris-tenant=' + storeConfig.storeTenant, '')
            .then(
            function (data) {
                console.log('login success');
                var token = getParameterByName('access_token', data.headers('Location'));
                var expiresIn = parseInt(getParameterByName('expires_in', data.headers('Location')));
                console.log('token is '+token);
                try {
                    storeConfig.token = token;
                    storeConfig.expiresIn = expiresIn;
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

            },
            function (error) {
                console.error('Unable to perform anonymous login:');
                console.error(error);
            }
        );



    })();
