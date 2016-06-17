/**
 * [y] hybris Platform
 *
 * Copyright (c) 2000-2016 hybris AG
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of hybris
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with hybris.
 */

 (function () {
    'use strict';

    angular.module('ds.products')
        .directive('productImgCarousel', ['$timeout', function ($timeout) {

            function templateLink (scope, elem) {

                scope.currentIndex = 0;

                var container = elem[0].querySelector('.main-image-container');
                container.style.height = container.offsetWidth + 'px';
                
                var positionImages = function () {
                    var images = elem[0].querySelector('.product-images').children;
                    for (var i = 0; i < images.length; i++) {
                        if (images[i].className.indexOf('product-image') > -1) {
                            images[i].style.transform = 'translateX(' + i * 100 + '%)';
                            images[i].style.width = '100%';
                        }
                    }
                };

                var positionMobileThumbs = function () {
                    var mobileThumbs = elem[0].querySelector('.mobileThumbs');
                    var count = mobileThumbs.children.length;
                    var width = mobileThumbs.children[0].offsetWidth;
                    var translateValue = count * width / 2;
                    mobileThumbs.style.transform = 'translateX(-' + translateValue + 'px)';
                };

                function FShandler() {
                    if (!document.fullscreen && !document.mozFullScreen && !document.webkitIsFullScreen && !document.msFullscreenElement) {
                        positionImages();
                    }
                }

                window.addEventListener('resize', function() {
                    container.style.height = container.offsetWidth + 'px';
                    positionMobileThumbs();
                }, true);

                document.addEventListener('fullscreenchange', FShandler, false);
                document.addEventListener('webkitfullscreenchange', FShandler, false);
                document.addEventListener('mozfullscreenchange', FShandler, false);
                document.addEventListener('MSFullscreenChange', FShandler, false);

                scope.moveCarousel = function (index) {
                    elem[0].querySelector('.product-images').style.transform = 'translateX(-' + index * 100 + '%)';
                    scope.currentIndex = index;
                };

                scope.enlargeImage = function () {
                    var image = elem[0].querySelector('.product-images').children[scope.currentIndex];
                    image.style.transform = 'translateX(0)';
                    image.style.width = 'inherit';
                    if (image.requestFullscreen) {
                        image.requestFullscreen();
                    } else if (image.msRequestFullscreen) {
                        image.msRequestFullscreen();
                    } else if (image.mozRequestFullScreen) {
                        image.mozRequestFullScreen();
                    } else if (image.webkitRequestFullscreen) {
                        image.webkitRequestFullscreen();
                    }
                };

                scope.$watchCollection('images', function(){
                    $timeout(positionImages, 0);
                    $timeout(positionMobileThumbs, 0);
                });
            }


            return {
                restrict: 'E',
                templateUrl: 'js/app/products/templates/product-img-carousel.html',
                link: templateLink,
                scope: {
                    images: '='
                }
            };

        }]);
})();