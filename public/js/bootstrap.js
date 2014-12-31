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

// Bootstrap the application for single tenant mode
(function () {

    var storeConfig = {};
    storeConfig.storeTenant = 'defaultproj';

    try {
        var pathLength = window.location.pathname.length;
        if(pathLength > 1){
            storeConfig.storeTenant = window.location.pathname.substring(1, pathLength-1);
        }
        console.log(storeConfig.storeTenant);
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
