/**
 * [y] hybris Platform
 *
 * Copyright (c) 2000-2014 hybris AG
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of hybris
 * ('Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with hybris.
 */

'use strict';

angular.module('ds.auth')
  /**
   * y-auth-popover
   * Popup displaying authorized user actions.
   */
  .directive('yAuthPopover', ['$http', '$templateCache', '$compile', 'AuthSvc', '$state',
    function ($http, $templateCache, $compile, AuthSvc, $state) {
        
      var getTemplate = function(url) {
        var promise = $http({ method: 'GET', url: url });
        promise.success(function(data) {
                  $templateCache.put(url, data);
                })
                .error(function() {
                  console.log('Error getting template ', url);
                });
        return promise;
      };

      return {
        restrict: 'EA',
        scope: { options: '=' },
        link: function(scope, element, attrs) {
          var options = scope.$eval(attrs.options || {}),
            $elem = $(element);
          
          scope.logout = function() {
            AuthSvc.signout();
            $elem.popover('hide');
          };

          scope.myProfile = function() {
            $state.go('base.profile');
            $elem.popover('hide');
          };

          if (options.templateUrl) {
            getTemplate(options.templateUrl)
                .success(function(data) {
                  options.content = $compile( angular.element(data) )(scope);
                  $elem.popover(options);
                })
                .error(function() {
                  options.content = '';
                  $elem.popover(options);
                });
          } else {
            $elem.popover(options);
          }
        }
      };

    }
  ]);