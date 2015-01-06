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

angular.module('ds.auth')
.directive('popOver', ['$compile', '$controller', function ( $compile, Controller) {

    var getController = function getController(controllerInstance, scope)
    {
        var controller;
        var controlsLocals = {
            loginOpts: {},
            showAsGuest: false
        };

        controlsLocals.$scope = scope;

        controller = new Controller(controllerInstance, controlsLocals);
        return controller;
    };

    return {
        restrict: 'A',
        scope:{
            templateUrl:'@',
            popoverClass:'@',
            popoverController:'@',
            popoverPlacement: '@'
        },

        link: function (scope, element) {
            
            var popoverTemplate = '';

            $.ajax({url:scope.templateUrl}).done(
                function(data){

                    popoverTemplate = '<div class="popover '+ scope.popoverClass + '" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="glyphicon glyphicon-remove js-closePopover popoverCloseBtn pull-right" aria-hidden="true"></div><div class="clear"></div><div class="popover-content">'+data +'</div></div>';
                });
            
            $(element).on('mouseenter click', function(e){

                var popoverContainer = $('<div class="popoverContainer"></div>');
                $(e.currentTarget).append(popoverContainer);
                popoverContainer.append(popoverTemplate);
                $compile(popoverContainer)(scope);
                
                var leftPos;
                var bottomPos = 0;
                var topPos = 0;
                leftPos = $(e.currentTarget).outerWidth() - 1;

                $('.js-closePopover').on('click', function(e){
                    $(element).find('.popoverContainer').remove();
                });
                
                //set positioning of container
                popoverContainer.css({left: leftPos + 'px' });
                
                if(scope.popoverPlacement)
                {
                    switch(scope.popoverPlacement.toLowerCase())
                    {
                        case 'bottom':
                            bottomPos -= 20;
                            popoverContainer.css({bottom: bottomPos + 'px'});
                            break;
                        
                        case 'top':
                            topPos -= 100;
                            popoverContainer.css({top: topPos + 'px'});
                            break;
                    }
                }

                getController(scope.popoverController, scope);
                scope.$digest();
                
            });

            $(element).on('mouseleave click', function(e){
                //on un-hover hide the popover
                $(e.currentTarget).find('.popoverContainer').remove();
            })

        }
    };
}]);
