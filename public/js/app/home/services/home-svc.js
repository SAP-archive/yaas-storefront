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
        .service('HomeSvc', ['GlobalData', 'settings', '$state',
            function (GlobalData, settings, $state) {

                var homeBannerId = 'homeBanner';

                /**
                 * Initializes all site content in objects that can be used in UI
                 * @return object that contains carousel images and banners
                 */
                var init = function init() {
                    var self = this;
                    var slidesLarge = [];
                    var slidesSmall = [];
                    var banner1 = {};
                    var banner2 = {};
                    var siteContent = GlobalData.getSiteBanners();

                    if (self.siteContentExists(siteContent)) {
                        if (!!siteContent.topImages && siteContent.topImages.length > 0) {

                            for (var i = 0; i < siteContent.topImages.length; i++) {
                                if (!!siteContent.topImages[i].large && siteContent.topImages[i].large.imageUrl !== '') {
                                    slidesLarge.push({ id: homeBannerId, image: siteContent.topImages[i].large });
                                }

                                if (!!siteContent.topImages[i].small && siteContent.topImages[i].small.imageUrl !== '') {
                                    slidesSmall.push({ id: homeBannerId, image: siteContent.topImages[i].small });
                                }
                            }
                        }
                        banner1 = siteContent.banner1;
                        banner2 = siteContent.banner2;
                    }
                    else {
                        //Redirect to all products page
                        $state.go(settings.allProductsState);
                    }

                    return {
                        slidesLarge: slidesLarge,
                        slidesSmall: slidesSmall,
                        banner1: banner1,
                        banner2: banner2
                    };
                };

                /**
                 * Checks if there is any site content defined for selected site
                 * @param siteContent - current site content
                 * @return true/false value that shows if there is site content for provided site
                 */
                var siteContentExists = function siteContentExists(siteContent) {
                    if (!siteContent) {
                        return false;
                    }

                    if (!!siteContent.topImages) {
                        for (var i = 0; i < siteContent.topImages.length; i++) {
                            if (!!siteContent.topImages[i] &&
                                !!siteContent.topImages[i].large &&
                                (siteContent.topImages[i].large.imageUrl !== '' ||
                                 siteContent.topImages[i].small.imageUrl !== '')) {
                                return true;
                            }
                        }
                    }

                    if (!!siteContent.banner1 &&
                        !!siteContent.banner1.large &&
                        (siteContent.banner1.large.imageUrl !== '' ||
                         siteContent.banner1.small.imageUrl !== '')) {
                        return true;
                    }

                    if (!!siteContent.banner2 && !!
                        !!siteContent.banner2.large &&
                        (siteContent.banner2.large.imageUrl !== '' ||
                         siteContent.banner2.small.imageUrl !== '')) {
                        return true;
                    }

                    return false;
                };

                return {
                    init: init,
                    siteContentExists: siteContentExists
                };

            }]);

})();