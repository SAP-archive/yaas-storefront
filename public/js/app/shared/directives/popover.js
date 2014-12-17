/**
 * Created by i839794 on 9/16/14.
 */
'use strict';

angular.module('ds.shared')
.directive('popOver', ['$compile', '$controller', 'AuthDialogManager', 'AuthSvc', 'settings', function ( $compile, Controller, AuthDialogManager, AuthSvc, settings) {

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
            popoverController:'@'
        },

        link: function (scope, element) {
            $.ajax({url:scope.templateUrl}).done(
                function(data){

                    var options = {
                        html: true,
                        template: ('<div class="popover '+ scope.popoverClass + '" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="glyphicon glyphicon-remove js-closePopover popoverCloseBtn pull-right" aria-hidden="true"></div><div class="clear"></div><div class="popover-content"></div></div>'),
                        content:  $compile(data)(scope)
                    };



                    $(function(){
//                        scope.fbAppId = settings.facebookAppId;
//
//                        AuthSvc.initFBAPI(scope);
//
//                        // scope variable used by google+ signing directive
//                        scope.googleClientId = settings.googleClientId;

                        $(element).popover(options).addClass(scope.popoverClass);


                        $(element).on('shown.bs.popover', function(){

                            getController(scope.popoverController, scope);
                            AuthDialogManager.showPopover();

                        });

                        $(document).on('click', '.js-closePopover', function(){
                            $(element).popover('hide');
                        });

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
