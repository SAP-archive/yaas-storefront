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

angular.module('ds.shared')
    .directive('stickyNavigation',[ '$timeout', function($timeout){

        var container;

        $(window).resize(function(){

            setNavigationHeight(container);
        });

        var setNavigationHeight = function setNavigationHeight(){
            var availableHeight = container.height();

            var reservedHeight, marginOffset;

            reservedHeight = 0;
            marginOffset = 0;

            $('.hy-stickyComponent').each(function(){
                reservedHeight += $(this).outerHeight(true) ;
            });

            if($('.hy-flexibleHeightNav').length > 0)
            {
                //get the margin for the container
                marginOffset += parseInt($('.hy-flexibleHeightNav').css('marginBottom').split('px')[0], 10);
                marginOffset += parseInt($('.hy-flexibleHeightNav').css('marginTop').split('px')[0], 10);
                //remove the margin offset for display
                reservedHeight -= marginOffset;
            }
            $('.hy-flexibleHeightNav .hy-scrollingNav').height( availableHeight  - reservedHeight );


        };

        return {
            restrict: 'A',
            link: function(scope, element) {
                container = $(element);
                angular.element(document).ready(function () {
                    $timeout(setNavigationHeight, 500);
                });
            }
        };
    }]);