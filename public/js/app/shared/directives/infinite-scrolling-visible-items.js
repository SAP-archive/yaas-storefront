/**
 * [y] hybris Platform
 *
 * Copyright (c) 2000-2014 hybris AG
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of hybris
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with hybris.
 */

'use strict';
//Used for determing the current visible items indexes
//It is checking if the details (name and price) part of item is visible
angular.module('ds.shared')
    .directive('infiniteScrollVisibleItems', ['$window', function ($window) {
        return {
            restrict: 'A',
            link: function (scope, element) {

                $window = angular.element($window);
                var lastScrollTop = 0;
                var firstIndex = 0;
                var elements = [];
                var i = 0;
                var offset = 0;

                var isElementInViewport = function (el) {
                    var rect = el.getBoundingClientRect();

                    return (
                        //Used 100 instead of 0 because of the navigation
                    rect.top >= 100 &&
                    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
                    );
                };

                var scrollDirectionUp = function () {
                    var st = $window.scrollTop();
                    var directionUp = true;
                    if (st > lastScrollTop) {
                        // down scroll
                        directionUp = false;
                    }
                    lastScrollTop = st;
                    return directionUp;
                };

                var handler = function (e) {

                    var firstVisibleIndex = 0;
                    var lastVisibleIndex = 0;
                    firstIndex = scope.pagination.productsFrom;
                    if (scrollDirectionUp()) {
                        //console.log('Scroll up');

                        //If it is scroll event then the checking is done only on small part of elements based
                        //on last visible items (if it is scroll up then the next visible items 100% have <= indexes
                        //than last one)
                        if(e.type === 'scroll'){
                            //Get all elements that have index smaller than scope.productsTo
                            elements = element.querySelectorAll('.productInfoContainer').slice(0,scope.pagination.productsTo);
                        }
                        else{
                            //Loop over all elements
                            elements = element.querySelectorAll('.productInfoContainer');
                        }

                        for (i = elements.length - 1; i >= 0; i--) {
                            //Find the first one that is visible
                            if (isElementInViewport(elements[i])) {
                                lastVisibleIndex = i + 1;
                                break;
                            }
                        }
                        firstVisibleIndex = 0;
                        for (i = lastVisibleIndex - 1; i >= 0; i--) {
                            //Find the first one that is visible
                            if (!isElementInViewport(elements[i])) {
                                firstVisibleIndex = i + 1;
                                break;
                            }
                        }
                        firstVisibleIndex += 1;

                        //offset = lastVisibleIndex - scope.pagination.productsTo;
                        offset = 0;
                    }
                    else {
                        //console.log('Scroll down');

                        if(e.type === 'scroll'){
                            //Get all elements from currently shown index - 3 until the end
                            // elements = element.querySelectorAll(':nth-child(n+' + queryIndex + ') .productInfoContainer');
                            elements = element.querySelectorAll('.productInfoContainer').slice(scope.pagination.productsFrom - 1);

                            offset = firstIndex;
                        }
                        else{
                            //Loop over all elements
                            elements = element.querySelectorAll('.productInfoContainer');

                            //Set offset to 1 because looping is done over all elements
                            offset = 1;
                        }


                        for (i = 0; i < elements.length; i++) {
                            if (isElementInViewport(elements[i])) {
                                firstVisibleIndex = i;
                                break;
                            }
                        }

                        lastVisibleIndex = elements.length - 1;
                        for (i = firstVisibleIndex; i < elements.length; i++) {
                            if (!isElementInViewport(elements[i])) {
                                lastVisibleIndex = i - 1;
                                break;
                            }
                        }
                    }

                    scope.$apply(function () {
                        scope.pagination.productsFrom = firstVisibleIndex + offset;
                        scope.pagination.productsTo = lastVisibleIndex + offset;
                    });

                    //console.log(scope.pagination.productsFrom);
                    //console.log(scope.pagination.productsTo);
                };

                $window.on('DOMContentLoaded load resize scroll', handler);
            }
        };
    }]);