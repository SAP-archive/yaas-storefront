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
            popoverController:'@'
        },

        link: function (scope, element) {

            var template = '';
            $.ajax({url:scope.templateUrl}).done(
                function(data){
                    template =  ('<div class="popover '+ scope.popoverClass + '" role="tooltip"><div class="arrow"></div><div class="glyphicon glyphicon-remove js-closePopover popoverCloseBtn pull-right" aria-hidden="true"></div><div class="clear"></div><div class="popover-content"></div></div>');
                    var options = {
                        trigger: 'click',
                        html: true,
                        template:template,
                        content:  $compile(data)(scope)
                    };

                    $(element).popover(options).addClass(scope.popoverClass);


                    $(element).on('shown.bs.popover', function(){
                        getController(scope.popoverController, scope);
                        scope.$digest();
                    });

                    $(document).on('click', '.js-closePopover', function(){
                        $(element).popover('hide');
                    });

                    $('html').on('click', function (e) {
                        //the 'is' for buttons that trigger popups
                        //the 'has' for icons within a button that triggers a popup
                        if (!$(element).is(e.target) && $(element).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
                            $(element).popover('hide');
                        }
                    });

                });

        }
    };
}]);
