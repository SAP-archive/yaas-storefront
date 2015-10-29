/*
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

describe('HomeCtrl Test', function () {

    var $scope, $rootScope, $controller, mockedGlobalData, mockedSettings, mockedState;

    beforeEach(angular.mock.module('ds.home'), function () { });

    beforeEach(inject(function (_$rootScope_, _$controller_, _$q_) {

        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();
        $controller = _$controller_;

        mockedSettings = {};
        mockedState = {
            go: jasmine.createSpy()
        };
    }));

    describe('Home Ctrl - no banners', function () {

        beforeEach(function () {
            mockedGlobalData = {
                getSiteBanners: jasmine.createSpy()
            };
            homeCtrl = $controller('HomeCtrl', { $scope: $scope, '$rootScope': $rootScope, 'GlobalData': mockedGlobalData, 'settings': mockedSettings, '$state': mockedState });
        });

        it('should display slides', function () {
            expect($scope.slidesLarge).toBeDefined();
            expect($scope.slidesSmall).toBeDefined();
            expect($scope.carouselInterval).toBeDefined();
        });

        it('should redirect to category page when there are no banners defined', function () {
            expect($scope.siteContent).not.toBeDefined();

            expect(mockedState.go).toHaveBeenCalled();
        });
    });

    describe('Home Ctrl - with banners', function () {
        var siteContent = {
            "topImages": [
               {
                   "large": {
                       "imageUrl": "topImage1lg",
                       "internal": true,
                       "hyperlinkUrl": ""
                   },
                   "small": {
                       "imageUrl": "topImage1sm",
                       "internal": true,
                       "hyperlinkUrl": ""
                   }
               },
               {
                   "large": {
                       "imageUrl": "topImage2lg",
                       "internal": true,
                       "hyperlinkUrl": ""
                   },
                   "small": {
                       "imageUrl": "",
                       "internal": true,
                       "hyperlinkUrl": ""
                   }
               },
               {
                   "large": {
                       "imageUrl": "",
                       "internal": true,
                       "hyperlinkUrl": ""
                   },
                   "small": {
                       "imageUrl": "small3",
                       "internal": true,
                       "hyperlinkUrl": ""
                   }
               }
            ],
            "banner1": {
                "large": {
                    "imageUrl": "banner1lg",
                    "internal": true,
                    "hyperlinkUrl": "http://bing.com"
                },
                "small": {
                    "imageUrl": "",
                    "internal": true,
                    "hyperlinkUrl": ""
                }
            },
            "banner2": {
                "large": {
                    "imageUrl": "banner2lg",
                    "internal": true,
                    "hyperlinkUrl": ""
                },
                "small": {
                    "imageUrl": "",
                    "internal": true,
                    "hyperlinkUrl": ""
                }
            }
        };
        beforeEach(function () {

            mockedGlobalData = {
                getSiteBanners: jasmine.createSpy().andReturn(siteContent)
            };
            homeCtrl = $controller('HomeCtrl', { $scope: $scope, '$rootScope': $rootScope, 'GlobalData': mockedGlobalData, 'settings': mockedSettings, '$state': mockedState });
        });

        it('should assign proper images to banners and carousel', function () {

            expect($scope.slidesLarge.length).toEqual(2);
            expect($scope.slidesSmall.length).toEqual(2);

            expect($scope.banner1).toEqualData({
                "large": {
                    "imageUrl": "banner1lg",
                    "internal": true,
                    "hyperlinkUrl": "http://bing.com"
                },
                "small": {
                    "imageUrl": "",
                    "internal": true,
                    "hyperlinkUrl": ""
                }
            });
            expect($scope.banner2).toEqualData({
                "large": {
                    "imageUrl": "banner2lg",
                    "internal": true,
                    "hyperlinkUrl": ""
                },
                "small": {
                    "imageUrl": "",
                    "internal": true,
                    "hyperlinkUrl": ""
                }
            });
        });

        it('should assign proper images to banners and carousel', function () {

            $scope.init = jasmine.createSpy();

            $rootScope.$broadcast('site:updated');

            expect($scope.init).toHaveBeenCalled();
        });
    });

});
