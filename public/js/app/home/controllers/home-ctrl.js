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

(function () {
    'use strict';

    angular.module('ds.home')
        .controller('HomeCtrl', ['$scope', 'HomeSvc',
            function ($scope, HomeSvc) {

                $scope.carouselInterval = 5000;
                $scope.slidesLarge = [];
                $scope.slidesSmall = [];
                $scope.banner1 = {};
                $scope.banner2 = {};

                //Get site content data from service
                $scope.getSiteContent = function getSiteContent() {
                    var siteContent = HomeSvc.init();

                    $scope.slidesLarge = siteContent.slidesLarge;
                    $scope.slidesSmall = siteContent.slidesSmall;
                    $scope.banner1 = siteContent.banner1;
                    $scope.banner2 = siteContent.banner2;
                };

                //Init site content data
                $scope.getSiteContent();

                //Listen for site change event
                $scope.$on('site:updated', function siteUpdated() {
                    $scope.getSiteContent();
                });

            }]);
})();