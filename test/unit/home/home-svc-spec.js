/*
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

describe('HomeSvc Test', function () {

    var $scope, $rootScope, $controller, homeSvc, mockedGlobalData, mockedSettings, mockedState;

    mockedGlobalData = {};
    mockedSettings = {};
    mockedState = {
        go: jasmine.createSpy()
    };

    beforeEach(function () {
        module('ds.home', function ($provide) {
            $provide.value('appConfig', {});
            $provide.value('GlobalData', mockedGlobalData);
            $provide.value('$state', mockedState);
        });
    });

    beforeEach(inject(function (_$rootScope_, _$controller_, _$q_, _HomeSvc_) {

        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();
        $controller = _$controller_;
        homeSvc = _HomeSvc_;

        console.warn(homeSvc);
    }));

    describe('Interface', function () {

        it('should expose correct interface', function () {
            expect(homeSvc.init).toBeDefined();
            expect(homeSvc.siteContentExists).toBeDefined();
        });

    });

    describe('Init()', function () {
        it('should check if site content exists and if not should redirect to all products page', function () {
            mockedGlobalData.getSiteBanners = jasmine.createSpy().andReturn({});

            homeSvc.init();

            expect(mockedState.go).toHaveBeenCalled();
        });

        it('should check if site content exists and if yes it should return object with all details', function () {
            mockedGlobalData.getSiteBanners = jasmine.createSpy().andReturn({
                topImages: [{
                    large: {
                        imageUrl: 'imgLarge1', hyperlinkUrl: ''
                    },
                    small: {
                        imageUrl: 'imgSmall1', hyperlinkUrl: ''
                    }
                }, {
                    large: {
                        imageUrl: '', hyperlinkUrl: ''
                    },
                    small: {
                        imageUrl: '', hyperlinkUrl: ''
                    }
                }],
                banner1: {
                    large: {
                        imageUrl: 'banner1Large', hyperlinkUrl: ''
                    },
                    small: {
                        imageUrl: 'banner1Small', hyperlinkUrl: ''
                    }
                }
            });

            var returnObj = homeSvc.init();

            expect(returnObj.slidesLarge).toEqualData([{ id: 'homeBanner', image: { imageUrl: 'imgLarge1', hyperlinkUrl: '' } }]);
            expect(returnObj.slidesSmall).toEqualData([{ id: 'homeBanner', image: { imageUrl: 'imgSmall1', hyperlinkUrl: '' } }]);
            expect(returnObj.banner1).not.toEqualData({});
            expect(returnObj.banner2).not.toBeDefined();


            mockedGlobalData.getSiteBanners = jasmine.createSpy().andReturn({
                banner1: {
                    large: {
                        imageUrl: 'banner1Large', hyperlinkUrl: ''
                    },
                    small: {
                        imageUrl: 'banner1Small', hyperlinkUrl: ''
                    }
                }
            });

            var returnObj = homeSvc.init();

            expect(returnObj.slidesLarge).toEqualData([]);
            expect(returnObj.slidesSmall).toEqualData([]);
            expect(returnObj.banner1).not.toEqualData({});
            expect(returnObj.banner2).not.toBeDefined();
        });
    });

    describe('siteContentExist()', function () {

        it('should return false if site content is not defined', function () {
            var result = homeSvc.siteContentExists();
            expect(result).toBe(false);
        });

        it('should check if top images are defined and return true if there is at least one image defined there', function () {
            var result = homeSvc.siteContentExists({
                topImages:[{
                    large: {
                        imageUrl: '', hyperlinkUrl: ''
                    },
                    small: {
                        imageUrl: 'banner1Small', hyperlinkUrl: ''
                    }
                }]
            });
            expect(result).toBe(true);

            result = homeSvc.siteContentExists({
                topImages: [{
                    large: {
                        imageUrl: '', hyperlinkUrl: ''
                    },
                    small: {
                        imageUrl: '', hyperlinkUrl: ''
                    }
                }, {
                    large: {
                        imageUrl: '', hyperlinkUrl: ''
                    },
                    small: {
                        imageUrl: 'banner1Small', hyperlinkUrl: ''
                    }
                }]
            });
            expect(result).toBe(true);

            result = homeSvc.siteContentExists({
                banner1: {
                    large: {
                        imageUrl: '', hyperlinkUrl: ''
                    },
                    small: {
                        imageUrl: 'smallUrl', hyperlinkUrl: ''
                    }
                }
            });
            expect(result).toBe(true);


            result = homeSvc.siteContentExists({
                banner2: {
                    large: {
                        imageUrl: '', hyperlinkUrl: ''
                    },
                    small: {
                        imageUrl: 'banner2Small', hyperlinkUrl: ''
                    }
                }
            });
            expect(result).toBe(true);

            result = homeSvc.siteContentExists({
                banner2: {
                    large: {
                        imageUrl: '', hyperlinkUrl: ''
                    },
                    small: {
                        imageUrl: '', hyperlinkUrl: ''
                    }
                }
            });
            expect(result).toBe(false);
        });
    });

});
