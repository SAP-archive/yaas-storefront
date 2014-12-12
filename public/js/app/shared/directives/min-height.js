/**
 * [y] hybris Platform
 *
 * Copyright (c) 2000-2014 hybris AG
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of hybris
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with hybris.
 */

'use strict';

angular.module('ds.shared')
    .directive('minHeight',['$timeout', function( $timeout){

        var container;
        var matchContainer;

        $(window).resize(function(){
            setMinHeight();
        });

        var setMinHeight = function setMinHeight(){

            container.css('min-height', (matchContainer.height() + 'px') );

        };

        return {
            restrict: 'A',
            scope: {
                hyMatchContainer: '@hyMatchContainer'
            },
            link: function(scope, element, attrs) {
                container = $(element);
                //if the window parameter is passed then make sure that we evaluate the window object
                matchContainer = $( ((scope.hyMatchContainer.toLowerCase() === 'window')? eval('{window}') : scope.hyMatchContainer.toLowerCase()) );
                $timeout(setMinHeight, 0);
            }
        };
    }]);