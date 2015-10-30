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
        .controller('HomeCtrl', ['$scope', 'GlobalData', 'settings', '$state',
            function ($scope, GlobalData, settings, $state) {

                $scope.carouselInterval = 5000;

                $scope.init = function init() {

                    $scope.slidesLarge = [];
                    $scope.slidesSmall = [];
                    $scope.siteContent = GlobalData.getSiteBanners();

                    if ($scope.siteContentExists($scope.siteContent)) {

                        for (var i = 0; i < $scope.siteContent.topImages.length; i++) {
                            if (!!$scope.siteContent.topImages[i].large && $scope.siteContent.topImages[i].large.imageUrl !== '') {
                                $scope.slidesLarge.push({ id: 'homeBanner', image: $scope.siteContent.topImages[i].large });
                            }

                            if (!!$scope.siteContent.topImages[i].small && $scope.siteContent.topImages[i].small.imageUrl !== '') {
                                $scope.slidesSmall.push({ id: 'homeBanner', image: $scope.siteContent.topImages[i].small });
                            }
                        }
                        $scope.banner1 = $scope.siteContent.banner1;
                        $scope.banner2 = $scope.siteContent.banner2;
                    }
                    else {
                        //Redirect to all products page
                        $state.go(settings.allProductsState);
                    }
                };

                $scope.siteContentExists = function siteContentExists(siteContent) {
                    if (!siteContent) {
                        return false;
                    }
                    for (var i = 0; i < siteContent.topImages.length; i++) {
                        if (siteContent.topImages[i].large.imageUrl !== '' || siteContent.topImages[i].small.imageUrl !== '') {
                            return true;
                        }
                    }
                    if (siteContent.banner1.large.imageUrl !== '' || siteContent.banner1.small.imageUrl !== '') {
                        return true;
                    }
                    if (siteContent.banner2.large.imageUrl !== '' || siteContent.banner2.small.imageUrl !== '') {
                        return true;
                    }
                    return false;
                };

                //Init site content data
                $scope.init();

                //Listen for site change event
                $scope.$on('site:updated', function siteUpdated() {
                    $scope.init();
                });

            }]);
})();