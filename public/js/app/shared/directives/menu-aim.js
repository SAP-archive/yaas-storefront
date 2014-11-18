/**
 * Created by i839794 on 9/16/14.
 */
'use strict';

angular.module('ds.shared')
    .directive('dsMenuAim', [function () {

        function activateSubmenu(row) {
            console.log('activate');
            angular.element(row).addClass('active');
        }

        function deactivateSubmenu(row) {
            //console.log('deactivate 1');
            angular.element(row).removeClass('active');
        }

        function exitMenu() {
            $('#sidebar .navi li').removeClass('active');
        }

        return {
            restrict: 'A',
            link: function ($scope, $element) {
                $scope.$watch('categories', function(newCats){
                    if(newCats){
                        $element.menuAim({
                            activate: activateSubmenu,
                            deactivate: deactivateSubmenu,
                            exitMenu: exitMenu,
                            rowSelector: 'li'
                        });

                        $(document).on('click','#sidebar .navi > li.has-sub > a',function(e){
                            //console.log('click sub with nav');
                            e.preventDefault();
                            $('#sidebar .navi > li > a').removeClass('mactive');
                            $(this).addClass('mactive');
                            $('#sidebar .navi').addClass('sub-1');
                        });

                        $(document).on('click','#sidebar .navi .sub-navi-list > li.has-sub > a',function(e){
                            //console.log('subnavi click')
                            e.preventDefault();
                            $('#sidebar .navi .sub-navi-list > li > a').removeClass('mactive');
                            $(this).addClass('mactive');
                            $('#sidebar .navi').addClass('sub-2');
                        });

                        $(document).on('click','#sidebar .navi ul.sub-navi-list > li.back > a',function(e){
                            e.preventDefault();
                            $('#sidebar .navi > li > a').removeClass('mactive');
                            $('#sidebar .navi').removeClass('sub-1');
                            $('#sidebar .navi').removeClass('sub-2');
                        });

                        $(document).on('click','#sidebar .navi ul.sub-navi-list  ul >  li.back > a',function(e){
                            e.preventDefault();
                            $('#sidebar .navi .sub-navi-list > li > a').removeClass('mactive');
                            $('#sidebar .navi').removeClass('sub-2');

                        });
                    }
                });

            }
        };
    }]);
