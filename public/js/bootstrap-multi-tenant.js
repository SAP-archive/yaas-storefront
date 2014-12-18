/**
 * [y] hybris Platform
 *
 * Copyright (c) 2000-2015 hybris AG
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of hybris
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with hybris.
 */

'use strict';


// Bootstrap the application for multi-tenant mode.
// Requires a service call to load the basic store information.
(function() {
    var initInjector = angular.injector(['ng']);
    var $http = initInjector.get('$http');
    $http.get('storeconfig').then(
        function (response) {

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
