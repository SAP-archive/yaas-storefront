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
    .directive('dsMenuAim', [function () {

        var removeActiveClasses = function removeActiveClasses(){
            //remove all category level active classes
            $('.categoryLevel').removeClass('mactive');
            //remove all secondary level active classes
            $('.secondaryCategory').removeClass('mactive');
            //remove all terial class active classes
            $('.tertiaryLevel').removeClass('mactive');
        };

        var setLevelDepthSelection = function setLevelDepthSelection(level, el){

            //find the elements primary category and select it
            var selectPrimaryCategory = function selectPrimaryCategory(el){
                el.parents('.js-listRoot').find('.mainCategory').addClass('mactive');
            };

            var selectSecondaryCategory = function selectSecondaryCategory(el){
                el.parents('.js-flyoutSubCategory').find('.secondaryCategory').addClass('mactive');
            };

            switch(level){
                case 'secondary':
                    selectPrimaryCategory(el);

                break;

                case 'tertiary':
                    selectPrimaryCategory(el);
                    selectSecondaryCategory(el);
                break;
                default:
                    //do nothing for default
                break;
            }
            //set the current element to active as it was the one selected
            el.addClass('mactive');

        };

        return {
            restrict: 'A',
            link: function ($scope, $element) {
                $scope.$watch('categories', function(newCats){
                    if(newCats){
                        $element.menuAim({
                            // Function to call when a row is purposefully activated. Use this
                            // to show a submenu's content for the activated row.
                            activate: function(row){
                                $(row).addClass('active');
                            },

                            // Function to call when a row is deactivated.
                            deactivate: function(row) {
                                $(row).removeClass('active');
                            },

                            // Function to call when mouse enters a menu row. Entering a row
                            // does not mean the row has been activated, as the user may be
                            // mousing over to a submenu.
                            enter: function() {},

                            // Function to call when mouse exits a menu row.
                            exit: function() {},

                            // Function to call when mouse exits the entire menu. If this returns
                            // true, the current row's deactivation event and callback function
                            // will be fired. Otherwise, if this isn't supplied or it returns
                            // false, the currently activated row will stay activated when the
                            // mouse leaves the menu entirely.
                            exitMenu: function() {
                                $('#sidebar .navi > li').removeClass('active');
                            },

                            // Selector for identifying which elements in the menu are rows
                            // that can trigger the above events. Defaults to "> li".
                            rowSelector: 'li',

                            // You may have some menu rows that aren't submenus and therefore
                            // shouldn't ever need to "activate." If so, filter submenu rows w/
                            // this selector. Defaults to "*" (all elements).
                            submenuSelector: '*',

                            // Direction the submenu opens relative to the main menu. This
                            // controls which direction is "forgiving" as the user moves their
                            // cursor from the main menu into the submenu. Can be one of "right",
                            // "left", "above", or "below". Defaults to "right".
                            submenuDirection: 'right'


                        });

                        $(document).on('click', '.mainCategory', function(){
                            /*remove all of the nested selected displays calsses*/
                            removeActiveClasses();
                            setLevelDepthSelection('primary', $(this));
                        });
//
                        $(document).on('click','.secondaryCategory',function(){
                            removeActiveClasses();
                            setLevelDepthSelection('secondary', $(this));
                        });
//
//
                        $(document).on('click','.tertiaryLevel',function(){
                            removeActiveClasses();
                            setLevelDepthSelection('tertiary',$(this));

                        });

                    }
                });

            }
        };
    }]);
