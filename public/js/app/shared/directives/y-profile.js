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

angular.module('ds.yprofile', [])
    .directive('yProfileToolbox', ['appConfig', 'CookieSvc', 'ytrackingSvc', function (appConfig, CookieSvc, ytrackingSvc) {
        return {
            restrict: 'E',
            scope: {},
            templateUrl: 'js/app/shared/templates/profile-toolbox.html',
            link: function (scope) {
                var tenantId = appConfig.storeTenant();
                var builderPath = appConfig.builderURL();
                var consentUrl = appConfig.consentManagerURL();

                scope.$on('tracing:response', function (event, contextTraceId) {
                    var tracingIdUrlPart = encodeURIComponent(JSON.stringify({'contextTraceId': contextTraceId}));

                    var params = $.param({
                        project: tenantId,
                        selectedPath: '/Home/' + tenantId + '/Hybris Profile Developer Tools/trace-explorer/' + tracingIdUrlPart
                    });
                    var href = builderPath + '#?' + params;
                    scope.lastEventUrl = href;
                    scope.lastEventId = contextTraceId;
                    console.log('Last event contextTraceId:', contextTraceId, 'url:', href);
                });

                function getCustomerConsentManagementServiceParams() {
                    var consentReference = CookieSvc.getConsentReferenceCookie();
                    var consentReferenceToken = CookieSvc.getConsentReferenceTokenCookie();

                    var params = $.param({
                        token: consentReferenceToken,
                        cr: consentReference,
                        t: tenantId
                    });
                    return params;
                }


                scope.isGranted = function () {
                    return ytrackingSvc.isGranted();
                };

                scope.goToConsentUI = function () {
                    var params = getCustomerConsentManagementServiceParams();

                    var url = consentUrl + '?' + params;
                    var win = window.open(url, '_blank');
                    win.focus();
                };

                scope.goToVisualizationUI = function () {
                    var params = getCustomerConsentManagementServiceParams();

                    var url = consentUrl + '/profile?' + params;
                    var win = window.open(url, '_blank');
                    win.focus();
                };

                scope.getProfileUrl = function () {
                    var params = $.param({
                        project: tenantId,
                        selectedPath: '/Home/' + tenantId + '/Hybris Profile Developer Tools/profile-browser/' + CookieSvc.getConsentReferenceCookie()
                    });
                    var href = builderPath + '#?' + params;
                    return href;
                };
            }
        };
    }])
    .directive('yProfileHeader', [function () {
        return {
            restrict: 'E',
            templateUrl: 'js/app/shared/templates/profile-header.html',
            scope: {}
        };
    }]);