/**
 * Created by i839794 on 9/16/14.
 */
'use strict';

angular.module('ds.shared')
    .directive('menuAim', function () {


        return {



            link: function (scope, element) {

                $(element).menuAim({
                    // Function to call when a row is purposefully activated. Use this
                    // to show a submenu's content for the activated row.
                    activate: function (row) {
                        $(row).addClass('active');
                    },

                    // Function to call when a row is deactivated.
                    deactivate: function (row) {
                        $(row).removeClass('active');
                    },

                    // Function to call when mouse enters a menu row. Entering a row
                    // does not mean the row has been activated, as the user may be
                    // mousing over to a submenu.
                    enter: function () {
                    },

                    // Function to call when mouse exits a menu row.
                    exit: function () {
                    },

                    // Function to call when mouse exits the entire menu. If this returns
                    // true, the current row's deactivation event and callback function
                    // will be fired. Otherwise, if this isn't supplied or it returns
                    // false, the currently activated row will stay activated when the
                    // mouse leaves the menu entirely.
                    exitMenu: function () {
                        $('#sidebar .navi > li').removeClass('active');
                    },

                    // Selector for identifying which elements in the menu are rows
                    // that can trigger the above events. Defaults to "> li".
                    rowSelector: '> li',

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
            }
        };
    })
    .directive('menuAimLevel1', function () {
        return {
            link: function (scope, element) {
                element.bind('click', function (e) {
                    console.log('click level 1');
                    e.preventDefault();
                    angular.element('#sidebar .navi > li > a').removeClass('mactive');
                    element.addClass('mactive');
                    element.addClass('sub-1');
                });
            }
        };
    })
    .directive('menuAimLevel2', function () {
        return {
            link: function (scope, element) {
                element.bind('click', function (e) {
                    console.log('click level 2');
                    e.preventDefault();
                    angular.element('#sidebar .navi .sub-navi-list > li > a').removeClass('mactive');
                    element.addClass('mactive');
                    angular.document.find('#sidebar .navi').addClass('sub-2');
                });
            }
        };
    });
