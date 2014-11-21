/**
 * Created by i839794 on 9/16/14.
 */
'use strict';

angular.module('ds.shared')
    .directive('dsMenuAim', [function () {

        function activateSubmenu(row) {
            angular.element(row).addClass('active');
        }

        function deactivateSubmenu(row) {
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

                        $(document).on('click', '.mainCategory', function(e){
                            /*remove all of the nested selectedd displays calsses*/
                            $('.secondaryCategory').removeClass('mactive');
                            $('.mainCategory').removeClass('mactive');

                            $(this).addClass('mactive');
                        });

                        $(document).on('click','.secondaryCategory',function(e){
                            $('.secondaryCategory').removeClass('mactive');
                            $(this).addClass('mactive');
                        });

                        $('#sidebar .navi ul.sub-navi-list > li.back > a').on('click',function(e){
                            e.preventDefault();
                            $('#sidebar .navi > li > a').removeClass('mactive');
                            $('#sidebar .navi').removeClass('sub-1');
                            $('#sidebar .navi').removeClass('sub-2');
                        });

                        $('#sidebar .navi ul.sub-navi-list  ul >  li.back > a').on('click',function(e){
                            e.preventDefault();
                            $('#sidebar .navi .sub-navi-list > li > a').removeClass('mactive');
                            $('#sidebar .navi').removeClass('sub-2');

                        });
                    }
                });

            }
        };
    }]);
