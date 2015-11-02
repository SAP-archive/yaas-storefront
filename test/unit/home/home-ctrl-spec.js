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

describe('HomeCtrl Test', function () {

    var $scope, $rootScope, $controller, mockedHomeSvc;

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
    }));

    describe('Home Ctrl - no banners', function () {

        beforeEach(function () {
            mockedHomeSvc = {
                init: jasmine.createSpy().andReturn({}),
                siteContentExists: jasmine.createSpy().andReturn(false)
            };
            homeCtrl = $controller('HomeCtrl', { $scope: $scope, '$rootScope': $rootScope, 'HomeSvc': mockedHomeSvc });
        });

        it('should not display slides as the slidesLarge and slidesSmall are undefined', function () {
            expect($scope.slidesLarge).not.toBeDefined();
            expect($scope.slidesSmall).not.toBeDefined();
            expect($scope.carouselInterval).toBeDefined();
        });

    });

    describe('Home Ctrl - banners', function () {

        beforeEach(function () {
            mockedHomeSvc = {
                init: jasmine.createSpy().andReturn({
                    slidesLarge: [],
                    slidesSmall: [],
                    banner1: {},
                    banner2: {},
                }),
                siteContentExists: jasmine.createSpy().andReturn(true)
            };
            homeCtrl = $controller('HomeCtrl', { $scope: $scope, '$rootScope': $rootScope, 'HomeSvc': mockedHomeSvc });
        });

        it('should display slides', function () {
            expect($scope.slidesLarge).toBeDefined();
            expect($scope.slidesSmall).toBeDefined();
            expect($scope.carouselInterval).toBeDefined();
        });

        it('should call init method when navigated to home page', function () {
            expect(mockedHomeSvc.init).toHaveBeenCalled();
        });

        it('should call init method when site:updated event happens', function () {
            expect(mockedHomeSvc.init).toHaveBeenCalled();
            
            $rootScope.$broadcast('site:updated');

            expect(mockedHomeSvc.init).toHaveBeenCalled();
        });
    });

});
