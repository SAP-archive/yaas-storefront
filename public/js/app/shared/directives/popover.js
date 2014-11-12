/**
 * Created by i839794 on 9/16/14.
 */
'use strict';

angular.module('ds.shared')
.directive('popOver', ['$compile', function ($compile) {
    return {
        restrict: 'A',
        scope:{
            templateUrl:'@',
            popoverClass:'@',
            popoverController:'@'
        },

        link: function (scope, element) {

//            debugger;
            $.ajax({url:scope.templateUrl}).done(
                function(data){

                    var options = {
                        html: true,
                        template: ('<div class="popover '+ scope.popoverClass + '" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'),
                        content:  $compile(data)(scope)
                    };

                    $(element).popover(options).addClass(scope.popoverClass)

                    $(element).on('click', function (e) {
                        console.log('the popover link has been clicked!');
//                        $(element).popover('show');

                    });

                    $(element).on('shown.bs.popover', function(){
//                        $compile(element.contents())(scope);
                    });



                });



        }
    };
}]);
