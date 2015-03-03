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


angular.module('ds.ytacking', [])
    .constant('yTrackingURL', 'https://nemanjapopovic.piwikpro.com/piwik.php')
    .directive('ytracking',['yTrackingURL' ,'$rootScope' ,'GlobalData', function(yTrackingURL, $rootScope, GlobalData) {
        return {
            scope:{
                enabled: '@ytrackingEnabled'
            },
            restrict: 'A',
            link: function (scope) {

                angular.element(document).ready(function () {

                    if (scope.enabled) {
                        var _paq = _paq || [];

                        scope.init = function () {

                            _paq.push(['trackPageView']);
                            _paq.push(['enableLinkTracking']);
                            (function () {
                                _paq.push(['setTrackerUrl', yTrackingURL]);
                                _paq.push(['setSiteId', 1]);
                                var d = document, g = d.createElement('script'), s = d.getElementsByTagName('script')[0];
                                g.type = 'text/javascript';
                                g.async = true;
                                g.defer = true;
                                g.src = 'https://cdnjs.cloudflare.com/ajax/libs/piwik/2.8.0/piwik.js';
                                s.parentNode.insertBefore(g, s);
                            })();
                        };

                        scope.trackUrlChange = function () {
                            $rootScope.$on('$stateChangeSuccess',
                                function (event, toState, toParams, fromState) {
                                    console.log(toState);

                                    _paq.push(['setCustomVariable', 1, toState.name, fromState.name, 'page']);
                                    _paq.push(['trackLink', toState.name]);
                                    _paq.push(['trackPageView', toState.name]);
                                });
                        };

                        //Start tracking
                        scope.url = yTrackingURL;

                        scope.init();
                        scope.trackUrlChange();

                    }
                });
            }
        };
    }]);
