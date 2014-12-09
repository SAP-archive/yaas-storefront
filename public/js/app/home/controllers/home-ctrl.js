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

angular.module('ds.home')

    .controller('HomeCtrl', ['$scope',
        function ($scope) {

            $scope.carouselInterval = 5000;
            var slides = $scope.slides = [];


            // ????? UPDATES NEEDED BELOW ????? //
            // below is only to create place holder content.
            //$scope.slides should be populated by a service that has real inamgs
            $scope.addSlide = function() {
                var newWidth = 600 + slides.length + 1;
                slides.push({
                    image: 'http://placekitten.com/' + newWidth + '/300',
                    text: ['More','Extra','Lots of','Surplus'][slides.length % 4] + ' ' +
                        ['Cats', 'Kittys', 'Felines', 'Cutes'][slides.length % 4]
                });
            };
            for (var i=0; i<4; i++) {
                $scope.addSlide();
            }


        }]
);
