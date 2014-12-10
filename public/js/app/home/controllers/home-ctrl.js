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
            $scope.slides = [
                {
                    image: './img/homePg-hero-audio.jpg',
                    url: 'http://www.google.com'
                },
                {
                    image: './img/homePg-hero-office.jpg',
                    url: 'http://www.google.com'
                }
            ];


        }]
);
