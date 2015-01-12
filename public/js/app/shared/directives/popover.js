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
            popoverPlacement: '@',
            showPopover: '@'
        },

        link: function (scope, element) {
            
            var popoverTemplate = '';
            var popoverContainer;
            var popoverVisible = false;
            
            var closePopover = function(popoverContainer)
            {
                popoverContainer.remove();
                popoverVisible = false;
            };

            $.ajax({url:scope.templateUrl}).done(
                function(data){
                    popoverTemplate = '<div class="popover '+ scope.popoverClass + '" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="glyphicon glyphicon-remove js-closePopover popoverCloseBtn pull-right" aria-hidden="true"></div><div class="clear"></div><div class="popover-content">'+data +'</div></div>';
                });
            
            $(element).on('mouseenter mouseleave click', function(e){

                if(!popoverVisible)
                {
                    popoverContainer = $('<div class="popoverContainer"></div>');
                    popoverContainer.append(popoverTemplate);
                    
//                    $(element).parent().append(popoverContainer);

                    $(element).append(popoverContainer);
                    popoverVisible = true;
                    $compile(popoverContainer)(scope);

                    var bottomPos = 0;
                    var topPos = 0;
                    var leftPos = $(e.currentTarget).outerWidth() - 1;

                    $('.js-closePopover').on('click', function(){
                        closePopover(popoverContainer);
                    });




                    if(scope.popoverPlacement)
                    {
                        switch(scope.popoverPlacement.toLowerCase())
                        {
                            case 'bottomofelement':
                                bottomPos -= 20;
                                popoverContainer.css({bottom: bottomPos + 'px'});
                                //set positioning of container
                                popoverContainer.css({left: leftPos + 'px' });
                                break;

                            case 'topofelement':
                                topPos -= 100;
                                popoverContainer.css({top: topPos + 'px'});
                                //set positioning of container
                                popoverContainer.css({left: leftPos + 'px' });
                                break;
                            case 'mobiletopmenu':
                                //set positioning of container
                                popoverContainer.css({right: -65 + 'px' });

                                var wCont = [$(window).width(), $(window).width()/1.2 ];
                                popoverContainer.css({width: (wCont[0] - (wCont[0]-wCont[1])) + 'px' });
                        }
                    }



                    getController(scope.popoverController, scope);
                    scope.$digest();
                    
                }
                else{
                    if(popoverContainer)
                    {
                        if(e.type === 'click'){
                            return;
                        }
                        closePopover(popoverContainer);
                    }

                    
                }
                
            });


        }
    };
}]);
