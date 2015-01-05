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
            loginOpts: {}
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
                    
//                    var options = {
//                        html: true,
//                        template: ('<div class="popover '+ scope.popoverClass + '" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="glyphicon glyphicon-remove js-closePopover popoverCloseBtn pull-right" aria-hidden="true"></div><div class="clear"></div><div class="popover-content"></div></div>'),
//                        content:  $compile(data)(scope)
//                    };
//
//                    $(element).popover(options).addClass(scope.popoverClass);
//
//
//                    $(element).on('shown.bs.popover', function(){
//                        getController(scope.popoverController, scope);
//                        scope.$digest();
//                    });
//
//                    $(document).on('click', '.js-closePopover', function(){
//                        $(element).popover('hide');
//                    });
//
//                    $('html').on('click', function (e) {
//                        //the 'is' for buttons that trigger popups
//                        //the 'has' for icons within a button that triggers a popup
//                        if (!$(element).is(e.target) && $(element).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
//                            $(element).popover('hide');
//                        }
//                    });

                });
            
            $(element).hover(function(e){

                var popoverContainer = $('<div class="popoverContainer"></div>');
                $(e.currentTarget).append(popoverContainer);
                popoverContainer.append(popoverTemplate);
                $compile(popoverContainer)(scope);
                
                var leftPos;
                var bottomPos = 0;
                leftPos = $(e.currentTarget).width();
                //set positioning of container
                popoverContainer.css({left: leftPos + 'px' });
                
                if(scope.popoverPlacement)
                {
                    if(scope.popoverPlacement.toLowerCase() === 'bottom')
                    {
                        bottomPos -= 20;
                        popoverContainer.css({bottom: bottomPos + 'px'});
                    }
                    
                }

                getController(scope.popoverController, scope);
                scope.$digest();
                
            }, function(e){
                $(e.currentTarget).find('.popoverContainer').remove();
            })

        }
    };
}]);
