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


(function () {
    'use strict';

    angular.module('ds.shared')
        .directive('siteSelector', function () {
            return {
                restrict: 'E',
                controller: 'SiteSelectorController',
                templateUrl: 'js/app/shared/directives/site-selector/site-selector.html'
            };
        });

})();