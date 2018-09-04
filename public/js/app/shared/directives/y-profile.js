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
    .directive('yProfileToolbox', ['appConfig', 'CookieSvc', function (appConfig, CookieSvc) {
        return {
            restrict: 'E',
            scope: {},
            templateUrl: 'js/app/shared/templates/profile-toolbox.html',
            link: function (scope) {
                var tenantId = appConfig.storeTenant();
                var builderPath = appConfig.builderURL();
                var consentUrl = appConfig.consentManagerURL();
                var region = appConfig.region();

                scope.isGranted = function () {
                    return !!CookieSvc.getConsentReferenceCookie() && !!window.localStorage.getItem('yaas-consent-reference-token');
                };

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
                    var consentReferenceToken = window.localStorage.getItem('yaas-consent-reference-token');

                    var params = $.param({
                        token: consentReferenceToken,
                        cr: consentReference,
                        t: tenantId
                    });
                    return params;
                }


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


                scope.goToProfileExplorer = function () {
                    var params = $.param({
                        region: region,
                        project: tenantId,
                        selectedPath: '/Home/' + tenantId + '/Hybris Profile Developer Tools/profile-browser/' + CookieSvc.getConsentReferenceCookie()
                    });
                    var url = builderPath + '#?' + params;
                    var win = window.open(url, '_blank');
                    win.focus();
                };

                window.Y_PROFILE_INTERCEPTOR.onTracingResponse(function (contextTraceId) {
                    if (!contextTraceId) {
                        return;
                    }

                    var tracingIdUrlPart = encodeURIComponent(JSON.stringify({
                        contextTraceId: contextTraceId
                    }));

                    var params = $.param({
                        region: region,
                        project: tenantId,
                        selectedPath: '/Home/' + tenantId + '/Hybris Profile Developer Tools/trace-explorer/' + tracingIdUrlPart
                    });
                    var url = builderPath + '#?' + params;

                    console.log('Last event contextTraceId:', contextTraceId, 'url:', url);
                    scope.lastEventUrl = url;
                    scope.lastEventId = contextTraceId;
                    scope.$apply();
                });
            }
        };
    }])
    .directive('yProfileHeader', [function () {
        return {
            restrict: 'E',
            templateUrl: 'js/app/shared/templates/profile-header.html',
            scope: {}
        };
    }])
    .directive('ytrackingCookieNotice', ['$window', '$timeout', function ($window, $timeout) {
        return {
            restrict: 'E',
            scope: {},
            link: function (scope) {

                function grant() {
                    // ytrackingSvc.grantConsent();
                    $timeout(function () {
                        scope.$apply();
                    });
                }

                function revoke() {
                    // ytrackingSvc.revoke();
                    $timeout(function () {
                        scope.$apply();
                    });
                }

                window.cookieconsent.initialise({
                    palette: {
                        popup: {
                            background: '#000'
                        },
                        button: {
                            background: '#f1d600'
                        }
                    },
                    compliance: {
                        'opt-in': '<div class="cc-compliance cc-highlight">{{allow}}</div>'
                    },
                    elements: {
                        messagelink: '<span id="cookieconsent:desc" class="cc-message">{{message}}</span>'
                    },
                    type: 'opt-in',
                    revokable: false,
                    revokeBtn: '<div style="display:none"></div>',
                    animateRevokable: false,
                    onInitialise: function () {
                        var didConsent = this.hasConsented();
                        if (didConsent) {
                            grant();
                        }
                    },
                    onStatusChange: function () {
                        var didConsent = this.hasConsented();
                        if (didConsent) {
                            grant();
                        }
                        if (!didConsent) {
                            revoke();
                        }
                    }
                });

            }
        };
    }]);
