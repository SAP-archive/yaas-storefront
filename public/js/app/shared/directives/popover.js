/**
 * Created by i839794 on 9/16/14.
 */
'use strict';

angular.module('ds.shared')
.directive('popOver', ['$compile', '$controller', 'AuthDialogManager',  function ( $compile, $controller, AuthDialogManager) {

    var getController = function getController(controllerInstance, scope)
    {
        var controller = undefined;
        var controlsLocals = {
            loginOpts: {}
        };

        controlsLocals.$scope = scope;

        controller = new $controller(controllerInstance, controlsLocals);
        return controller;
    }

    return {
        restrict: 'A',
        scope:{
            templateUrl:'@',
            popoverClass:'@',
            popoverController:'@'
        },

        link: function (scope, element, attrs, ctrl) {
            $.ajax({url:scope.templateUrl}).done(
                function(data){

                    var options = {
                        html: true,
                        template: ('<div class="popover '+ scope.popoverClass + '" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'),
                        content:  $compile(data)(scope)
                    };

                    $(element).popover(options).addClass(scope.popoverClass)


                    $(element).on('shown.bs.popover', function(){

                        getController(scope.popoverController, scope);
                        AuthDialogManager.showPopover();
//
                    });

                    $('html').on('click', function(e) {
                        if (typeof $(e.target).data('original-title') == 'undefined' && !$(e.target).parents().is('.popover.in')) {
                            $('[data-original-title]').popover('hide');
                        }
                    });



                });



        }
    };
}]);
